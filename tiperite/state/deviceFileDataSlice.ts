import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DeviceFileData } from '../types';

export const deviceFileDataSlice = createSlice({
  initialState: null as DeviceFileData | null,
  reducers: {
    /**
     * Set the entire `deviceFileData` object
     */
    set(_, action: PayloadAction<DeviceFileData>): DeviceFileData {
      return action.payload;
    },
  },
  name: 'deviceFileData',
});
