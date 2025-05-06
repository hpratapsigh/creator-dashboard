'use client';

import { useEffect, useState } from 'react';
import axios from '../lib/axiosInstance';
import { useRouter } from 'next/navigation';
import {
  FaUsers, FaRss, FaChevronRight, FaSearch,
  FaBell, FaSignOutAlt, FaChartBar, FaEdit,
  FaCrown, FaUserAlt, FaCoins
} from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  credits?: number;
}

interface Feed {
  id: string;
  title: string;
  source: string;
  link: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [credit, setCredit] = useState<number>(0);
  const [role, setRole] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'feeds' | 'analytics'>('users');
  const [analytics, setAnalytics] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios.get('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err));

    axios.get('/api/feed/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setFeeds(res.data))
      .catch((err) => console.error('Error fetching feeds:', err));
  }, [router]);

  // Update analytics whenever users or feeds change
  useEffect(() => {
    if (users.length > 0 && feeds.length > 0) {
      const newAnalytics = calculateAnalytics();
      setAnalytics(newAnalytics);
    }
  }, [users, feeds]);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setCredit(user.credits ?? 0);
    setRole(user.role);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    const token = localStorage.getItem('token');
    const updatedUser = {
      email: selectedUser.email,
      credit,
      role,
    };

    try {
      await axios.put('/api/admin/users/change', updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowModal(false);
      setSelectedUser(null);

      // Refresh user list
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Analytics data preparation
  const calculateAnalytics = () => {
    // User statistics
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const regularUsers = users.filter(user => user.role === 'user').length;

    // Credit statistics
    const totalCredits = users.reduce((sum, user) => sum + (user.credits || 0), 0);
    const avgCreditsPerUser = totalUsers > 0 ? Math.round(totalCredits / totalUsers) : 0;

    // Generate user-feed relationship data
    const userFeedRelationship = users.slice(0, 5).map(user => ({
      name: user.name,
      feedsSubscribed: Math.floor(Math.random() * feeds.length), // Random number of feeds per user for demo
      creditsSpent: user.credits ? Math.round(user.credits * 0.7) : 0, // Mock calculation
    }));

    // Credit distribution among users
    const creditDistribution = users.slice(0, 6).map(user => ({
      name: user.name,
      credits: user.credits || 0,
    }));

    // User role distribution data
    const roleDistribution = [
      { name: 'Admin', value: adminUsers },
      { name: 'Regular', value: regularUsers }
    ];

    // Create monthly trend data (mock data for visualization)
    const monthlyTrends = [
      { name: 'Jan', users: 20, credits: 540 },
      { name: 'Feb', users: 35, credits: 620 },
      { name: 'Mar', users: 45, credits: 750 },
      { name: 'Apr', users: 60, credits: 890 },
      { name: 'May', users: totalUsers, credits: totalCredits }
    ];

    return {
      userStats: { total: totalUsers, admin: adminUsers, regular: regularUsers },
      creditStats: { total: totalCredits, average: avgCreditsPerUser },
      userFeedRelationship,
      creditDistribution,
      roleDistribution,
      monthlyTrends
    };
  };

  const filteredFeeds = feeds.filter(feed =>
    feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feed.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-indigo-900 text-white p-6 hidden md:block">
          <div className="mb-12">
            <h1 className="text-xl font-bold mb-2">Creator</h1>
            <p className="text-indigo-200 text-sm">Admin Dashboard</p>
          </div>
 
          <nav className="space-y-6">
            <div>
              <p className="text-indigo-300 text-xs uppercase font-medium mb-3">Management</p>
              <ul className="space-y-2">
                <li
                  className={`flex items-center space-x-3 p-2 ${activeTab === 'users' ? 'bg-indigo-800' : 'hover:bg-indigo-800/50'} rounded-lg cursor-pointer transition`}
                  onClick={() => setActiveTab('users')}
                >
                  <FaUsers size={16} />
                  <span>Users</span>
                </li>
                <li
                  className={`flex items-center space-x-3 p-2 ${activeTab === 'feeds' ? 'bg-indigo-800' : 'hover:bg-indigo-800/50'} rounded-lg cursor-pointer transition`}
                  onClick={() => setActiveTab('feeds')}
                >
                  <FaRss size={16} />
                  <span>Feeds</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-indigo-300 text-xs uppercase font-medium mb-3">Settings</p>
              <ul className="space-y-2">
                <li
                  className={`flex items-center space-x-3 p-2 ${activeTab === 'analytics' ? 'bg-indigo-800' : 'hover:bg-indigo-800/50'} rounded-lg cursor-pointer transition`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <FaChartBar size={16} />
                  <span>Analytics</span>
                </li>
                <li
                  className="flex items-center space-x-3 p-2 hover:bg-indigo-800/50 rounded-lg cursor-pointer transition"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt size={16} />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white shadow-sm p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="relative w-64">
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-200 w-full text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
                  <FaBell size={16} />
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <span className="text-sm font-medium text-indigo-800">Admin</span>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto p-6">
            <div className="mb-10">
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-500">Manage your users and feeds</p>
            </div>

            {/* Users Content */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Users</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
                        {user.name[0]}
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mt-4">{user.name}</h3>
                      <p className="text-gray-500 mb-2">{user.email}</p>
                      
                      {/* Role Badge */}
                      <div className={`flex items-center px-3 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'} mt-2`}>
                        {user.role === 'admin' ? (
                          <><FaCrown className="mr-1" size={12} /> Admin</>
                        ) : (
                          <><FaUserAlt className="mr-1" size={12} /> User</>
                        )}
                      </div>
                      
                      {/* Credits Display */}
                      <div className="flex items-center mt-3 text-amber-600">
                        <FaCoins className="mr-2" />
                        <span className="font-medium">{user.credits || 0} Credits</span>
                      </div>
                      
                      <button
                        className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-2 px-6 rounded-lg font-medium transition duration-300 shadow-md hover:shadow-lg"
                        onClick={() => openEditModal(user)}
                      >
                        Edit User
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feeds Content */}
            {activeTab === 'feeds' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Feeds</h2>
                <ul className="space-y-4">
                  {filteredFeeds.map((feed) => (
                    <li key={feed.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{feed.title}</h3>
                        <p className="text-gray-500">{feed.source}</p>
                      </div>
                      <a
                        href={feed.link}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center"
                      >
                        View Feed <FaChevronRight className="ml-1" size={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analytics Content */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h2>
                
                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">User Stats</h3>
                      <FaUsers className="text-indigo-600" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-indigo-600">{analytics.userStats.total}</p>
                    <p className="text-gray-500">Total Users</p>
                    <div className="flex justify-between mt-4 text-sm">
                      <span className="text-purple-700">Admin: {analytics.userStats.admin}</span>
                      <span className="text-blue-700">Regular: {analytics.userStats.regular}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Total Credits</h3>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <FaCoins className="text-amber-500" size={24} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-amber-500">{analytics.creditStats.total}</p>
                    <p className="text-gray-500">Credits in System</p>
                    <div className="mt-4 text-sm">
                      <span className="text-amber-700">Avg per User: {analytics.creditStats.average}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Total Feeds</h3>
                      <FaRss className="text-green-600" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{feeds.length}</p>
                    <p className="text-gray-500">Active Feeds</p>
                    <div className="mt-4 text-sm">
                      <span className="text-green-700">Avg per User: {(feeds.length / analytics.userStats.total).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Visual Charts Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">User Role Distribution</h3>
                    <div className="relative w-40 h-40 mx-auto">
                      <div
                        className="absolute w-full h-full rounded-full"
                        style={{
                          background: `conic-gradient(
                            #4ade80 0% ${Math.round((analytics.userStats.admin / analytics.userStats.total) * 100)}%, 
                            #60a5fa ${Math.round((analytics.userStats.admin / analytics.userStats.total) * 100)}% 100%
                          )`
                        }}
                      ></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-28 h-28 flex flex-col items-center justify-center">
                        <p className="text-gray-800 font-semibold">Total</p>
                        <p className="text-gray-800 text-lg font-bold">{analytics.userStats.total}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-800 flex flex-col items-center">
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-green-400 mr-2"></span>
                        Admin: {analytics.userStats.admin}
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-blue-400 mr-2"></span>
                        User: {analytics.userStats.regular}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Feeds by Source</h3>
                    <div className="w-full max-w-md">
                      {['Hacker News', 'Reddit'].map((source) => {
                        const count = feeds.filter(feed => feed.source.toLowerCase().includes(source.toLowerCase())).length;
                        const percentage = feeds.length > 0 ? (count / feeds.length) * 100 : 0;
                        return (
                          <div key={source} className="mb-4">
                            <div className="flex justify-between text-sm text-gray-800 mb-2">
                              <span className="font-medium">{source}</span>
                              <span>{count} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                              <div
                                className="bg-indigo-500 h-full rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Edit User Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User: {selectedUser.name}</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <p className="text-gray-500">{selectedUser.email}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Credits</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={credit}
                onChange={(e) => setCredit(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}