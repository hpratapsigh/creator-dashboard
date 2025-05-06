'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-extrabold tracking-tight">Creator Dashboard</div>
      <div className="space-x-6 flex items-center">
        <Link href="/" className="hover:text-blue-200 transition font-medium">
          Dashboard
        </Link>
        <Link href="/feed" className="hover:text-blue-200 transition font-medium">
          Feed
        </Link>
        <Link href="/profile" className="hover:text-blue-200 transition font-medium">
          Profile
        </Link>
        <button
          onClick={logout}
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
