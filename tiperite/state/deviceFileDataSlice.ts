import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { DeviceFileData, RootState } from '../types';

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

export const selectDeviceFileData = (
  s: RootState,
): ReturnType<typeof deviceFileDataSlice.reducer> => s.deviceFileData;

export const selectNonNullableDeviceFileData = (
  s: RootState,
): NonNullable<ReturnType<typeof deviceFileDataSlice.reducer>> =>
  s.deviceFileData as NonNullable<DeviceFileData>;
