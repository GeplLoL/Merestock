import api from './api';
export const fetchUsers = async () => {
  const res = await api.get('/User');
  return res.data;
};
