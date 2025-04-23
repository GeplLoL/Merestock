// src/redux/userSlice.js

import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    info:  null,
  },
  reducers: {
    // Принимаем payload = { token: string, info: object }
    setUser(state, action) {
      state.token = action.payload.token;
      state.info  = action.payload.info;
    },
    logout(state) {
      state.token = null;
      state.info  = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
