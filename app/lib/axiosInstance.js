// lib/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://creator-backend.vercel.app/',  // This is where your backend is running
});

export default axiosInstance;
