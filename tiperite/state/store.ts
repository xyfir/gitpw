import { deviceFileDataSlice } from './deviceFileDataSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    deviceFileData: deviceFileDataSlice.reducer,
    // bootFileData
  },
});
