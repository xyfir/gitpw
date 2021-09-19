import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { BootFileData } from '../types';
import { BootFile } from '../utils/BootFile';

export const bootFileDataSlice = createSlice({
  initialState: BootFile.generateDefaultData(1, ''),
  reducers: {
    setBootFileData(_, action: PayloadAction<BootFileData>): BootFileData {
      return action.payload;
    },
  },
  name: 'bootFileData',
});
