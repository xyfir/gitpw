import { deviceFileDataSlice } from './deviceFileDataSlice';
import { bootFileDataSlice } from './bootFileDataSlice';
import { configureStore } from '@reduxjs/toolkit';
import { themeSlice } from './themeSlice';

export const store = configureStore({
  reducer: {
    deviceFileData: deviceFileDataSlice.reducer,
    bootFileData: bootFileDataSlice.reducer,
    theme: themeSlice.reducer,
  },
});
