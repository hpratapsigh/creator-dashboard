'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const registerHandler = async () => {
    // Form validation
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Creating your account...');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name,
        email,
        password,
      });
      
      toast.dismiss(loadingToast);
      toast.success('Registration successful! Please log in');
      router.push('/login');
    } catch (error:any) {
      toast.dismiss(loadingToast);
      
      // Provide more specific error messages if possible
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-6">Create Account</h2>
        <div className="space-y-5">
          <input
            className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-gray-700 placeholder-gray-400"
            placeholder="Enter your name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <input
            className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-gray-700 placeholder-gray-400"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <input
            className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-gray-700 placeholder-gray-400"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition transform ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700 active:scale-95'
            }`}
            onClick={registerHandler}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:text-green-800 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}