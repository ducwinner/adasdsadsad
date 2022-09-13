import { configureStore } from '@reduxjs/toolkit';
import specificProductSlice from './specificProductSlice';

const rootReducer = {
  specificProductSlice,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
