import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const propertyService = {
  getMine: () => api.get('/properties/owner'),
  add: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  updateStatus: (id, status) => api.put(`/properties/${id}/status`, { status }),
  uploadImages: (formData) => api.post('/properties/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const propertyRequestService = {
  getMine: () => api.get('/property-requests/owner'),
  add: (data) => api.post('/property-requests', data),
  delete: (id) => api.delete(`/property-requests/${id}`),
};

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const dashboardService = {
  getStats: () => api.get('/owner-dashboard/stats'),
};

export const bookingService = {
  getMine: () => api.get('/owner-dashboard/bookings'),
};

export const enquiryService = {
  getMine: () => api.get('/owner-dashboard/enquiries'),
};

export const offerService = {
  getMine: () => api.get('/offers/owner'),
  create: (data) => api.post('/offers', data),
  remove: (id) => api.delete(`/offers/${id}`),
};

export default api;
