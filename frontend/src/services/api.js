// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studentToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studentToken');
      localStorage.removeItem('studentData');
      window.location.href = '/student/login';
    }
    return Promise.reject(error);
  }
);

export const studentAPI = {
  register: (data) => api.post('/students/register', data),
  login: (data) => api.post('/students/login', data),
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  getCredentials: () => api.get('/students/credentials')
};

export default api;

