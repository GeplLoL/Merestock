import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts } from '../services/productService';

export const loadProducts = createAsyncThunk(
  'product/load',
  async () => await fetchProducts()
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    list: [],
    status: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadProducts.pending, state => { state.status = 'loading'; })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list   = action.payload;
      })
      .addCase(loadProducts.rejected, state => {
        state.status = 'failed';
      });
  },
});

export default productSlice.reducer;
