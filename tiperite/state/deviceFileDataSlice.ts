import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DeviceFileData } from '../types';
import { DeviceFile } from '../utils/DeviceFile';

export const deviceFileDataSlice = createSlice({
  initialState: DeviceFile.getDefaultData(),
  reducers: {
    setDeviceFileData(
      _,
      action: PayloadAction<DeviceFileData>,
    ): DeviceFileData {
      return action.payload;
    },
  },
  name: 'deviceFileData',
});
