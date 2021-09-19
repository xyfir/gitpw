import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { BootFileData } from '../types';

export const bootFileDataSlice = createSlice({
  initialState: null as BootFileData | null,
  reducers: {
    /**
     * Set the entire `bootFileData` object
     */
    set(_, action: PayloadAction<BootFileData>): BootFileData {
      return action.payload;
    },
  },
  name: 'bootFileData',
});
