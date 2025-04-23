// src/services/authService.js

import api from './api';

export default {
  login: async (email, password) => {
    const res = await api.post('/login', { email, password });
    console.log('🔑 login response.data:', res.data);
    const data = res.data;
    if (!data.token) {
      throw new Error(data.message || 'Invalid credentials');
    }
    return data;
  },

  register: async (email, password) => {
    console.log('→ calling /User/register', { email, password });
    const res = await api.post('/User/register', { email, password });
    console.log('← /User/register response', res.data);
    return res.data;
  },

  refresh: () => api.get('/User/refresh').then(res => res.data),
};
