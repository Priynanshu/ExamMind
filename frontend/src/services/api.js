import axios from "axios";

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: `${import.meta.env.VITE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - automatically add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("examind-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 (token expired) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear storage and redirect to login
      localStorage.removeItem("examind-token");
      localStorage.removeItem("examind-user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
