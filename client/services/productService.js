import api from './api';

export const fetchProducts = async () => {
  const res = await api.get('/Product');
  return res.data;
};

export const addProduct = async (product) => {
  const res = await api.post('/Product', product);
  return res.data;
};
