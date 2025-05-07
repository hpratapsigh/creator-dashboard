// Dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from '../lib/axiosInstance';
import { useRouter } from 'next/navigation';
import { FiUser, FiCreditCard, FiBookmark, FiClock, FiExternalLink, FiTrash2 } from 'react-icons/fi';
import Navbar from '@/components/Navbar';

interface FeedItem {
  id: string;
  title: string;
  link: string;
  source?: string;
}

interface User {
  name?: string;
  email?: string;
  credits: number;
  savedFeeds: FeedItem[];
  activityLog: string[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User>({ credits: 0, savedFeeds: [], activityLog: [] });
  const [localSaved, setLocalSaved] = useState<FeedItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
  
    axios
      .get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        
        // Get saved feeds from local storage based on the user's email
        const userEmail = res.data.email;
        const savedFeedsKey = `savedFeeds_${userEmail}`;
        const local = JSON.parse(localStorage.getItem(savedFeedsKey) || '[]');
        setLocalSaved(local);
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
        if (err.response?.status === 401) {
          router.push('/login');
        }
      });
  }, [router]);  

  const handleUnsave = (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to unsave items!');
      return;
    }
  
    axios
      .get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const userEmail = res.data.email;
        const savedFeedsKey = `savedFeeds_${userEmail}`;
  
        // Get saved feeds from local storage using the unique key for the user
        const updated = localSaved.filter((item) => item.id !== id);
  
        // Update local storage with the filtered list
        localStorage.setItem(savedFeedsKey, JSON.stringify(updated));
        setLocalSaved(updated);
        alert('Removed from saved items');
      })
      .catch((err) => {
        console.error('Error fetching user details:', err);
        alert('Failed to unsave feed. Please try again later.');
      });
  };
  
  const allSaved = [...(user.savedFeeds || []), ...localSaved];

  return (
    <>
    <Navbar/>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-green-800 mb-6 text-center md:text-left flex items-center gap-2">
            <span className="bg-green-800 text-white p-2 rounded-lg">
              <FiUser className="inline-block" />
            </span>
            Dashboard
          </h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Account Overview */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-green-500">
              <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                <FiUser className="text-green-600" />
                Account Overview
              </h2>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <FiUser className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 uppercase">Name</p>
                    <p className="text-lg font-semibold text-blue-600">{user.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <FiCreditCard className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 uppercase">Email</p>
                    <p className="text-lg font-semibold text-blue-600">{user.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <FiCreditCard className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-800 uppercase">Credits</p>
                    <p className="text-lg font-semibold text-blue-600">{user.credits}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-green-700 flex items-center gap-2 mb-3">
                  <FiClock className="text-green-600" />
                  Recent Activity
                </h3>
                <div className="bg-green-50 rounded-lg p-4">
                  {user.activityLog?.length ? (
                    <ul className="space-y-2">
                      {user.activityLog?.slice(-5).map((act, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
                          <span className="inline-block bg-green-200 h-2 w-2 rounded-full mt-1.5 mr-2"></span>
                          <span className="truncate">{act}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic text-center">No recent activity</p>
                  )}
                </div>
              </div>
            </div>

            {/* Saved Content */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-green-500">
              <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                <FiBookmark className="text-green-600" />
                Saved Content
              </h2>

              {allSaved.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 bg-green-50 rounded-lg">
                  <FiBookmark className="text-green-300 text-5xl mb-3" />
                  <p className="text-gray-500 italic text-center">No saved posts yet.</p>
                  <p className="text-gray-500 text-sm text-center mt-1">
                    Browse your feed to save interesting content!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {allSaved.map((post: FeedItem, idx) => (
                    <div
                      key={idx}
                      className="border border-green-200 p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-all duration-200"
                    >
                      <p className="font-medium text-gray-800 mb-2">{post.title}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        {post.source || 'Unknown source'}
                      </p>
                      <div className="flex justify-between items-center">
                        <a
                          href={post.link}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full transition-all"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FiExternalLink size={14} /> View
                        </a>
                        {localSaved.some((item) => item.id === post.id) && (
                          <button
                            onClick={() => handleUnsave(post.id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-all"
                          >
                            <FiTrash2 size={14} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}