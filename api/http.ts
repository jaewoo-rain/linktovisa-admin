// 파일: src/api/http.ts
import axios from 'axios';

const http = axios.create({
  baseURL: 'https://api.example.com', // Placeholder
  timeout: 5000,
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    // Token logic here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

export default http;