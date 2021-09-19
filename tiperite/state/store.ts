import { deviceFileDataSlice } from './deviceFileDataSlice';
import { bootFileDataSlice } from './bootFileDataSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    deviceFileData: deviceFileDataSlice.reducer,
    bootFileData: bootFileDataSlice.reducer,
  },
});
