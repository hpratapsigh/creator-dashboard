'use client';

import { useState } from 'react';
import axios from '../lib/axiosInstance';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginHandler = async () => {
    // Form validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Logging in...');

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, user } = res.data;

      // Save token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.dismiss(loadingToast);
      toast.success(`Welcome back, ${user.name || 'User'}!`);

      // Redirect based on user role
      if (user.role === 'admin') {
        router.push('/admin');  // Redirect to admin dashboard
      } else {
        router.push('/');  // Regular user dashboard
      }
    } catch (error:any) {
      toast.dismiss(loadingToast);
      
      // Provide more specific error messages if possible
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      loginHandler();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">Welcome Back</h2>
        <div className="space-y-5">
          <input
            className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700 placeholder-gray-400"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <input
            className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700 placeholder-gray-400"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 active:scale-95'
            }`}
            onClick={loginHandler}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}