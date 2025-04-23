// redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import userReducer    from './userSlice';    // редьюсер аутентификации
import productReducer from './productSlice'; // редьюсер товаров
import usersReducer   from './usersSlice';   // редьюсер списка пользователей

export const store = configureStore({
  reducer: {
    user:    userReducer,
    product: productReducer,
    users:   usersReducer,
  },
});
