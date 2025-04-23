// src/services/api.js

import axios from 'axios';
import { Platform } from 'react-native';
import { store } from '../redux/store';



const api = axios.create({
  baseURL: 'http://localhost:7023/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = store.getState().user.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
