import axios from 'axios';

// 1. Create the central Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Port is 8080
});

// 2. THIS IS THE "MAGIC": The Axios Interceptor
// This code will run BEFORE every single request our app makes.
api.interceptors.request.use(
  (config) => {
    // 3. Get the token from localStorage
    const token = localStorage.getItem('jwtToken');

    // 4. If the token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 5. Return the (modified) request config
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default api;