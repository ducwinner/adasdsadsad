import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const specificProductSlice = createSlice({
  name: 'lstSpecificProduct',
  initialState,
  reducers: {
    addProducts(state, actions) {
      state = actions.payload;
    },
    deleteProduct(state, actions) {
      state.splice(state.indexOf(actions));
    },
  },
});

export const { addProducts, deleteProduct } = specificProductSlice.actions;

export default specificProductSlice.reducer;
