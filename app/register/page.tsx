'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState(''); // Add state for name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const registerHandler = async () => {
    try {
      // Log the data being sent
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name,
        email,
        password,
      });
            console.log(response); // Log the response to check if registration was successful
      router.push('/login');
    } catch (error) {
      console.error(error); // Log the error for debugging
      alert('Registration failed');
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
            onChange={(e) => setName(e.target.value)} // Update name state
          />
          <input
            className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-gray-700 placeholder-gray-400"
            placeholder="Enter your email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-gray-700 placeholder-gray-400"
            type="password"
            placeholder="Create a password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition transform active:scale-95"
            onClick={registerHandler}
          >
            Register
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:text-green-800 font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}