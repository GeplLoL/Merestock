// src/services/userService.js

import api from './api';

// GET http://<host>/api/User
export const fetchUsers = async () => {
  const res = await api.get('/User');
  // console.log('🏷️ fetchUsers →', res.data);
  return res.data; // ожидается массив пользователей
};
