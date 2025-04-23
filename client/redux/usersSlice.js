// src/redux/usersSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsers } from '../services/userService';

// Thunk для загрузки списка пользователей
export const loadUsers = createAsyncThunk(
  'users/load',
  async () => {
    const users = await fetchUsers();
    return users;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadUsers.pending, state => {
        state.status = 'loading';
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
