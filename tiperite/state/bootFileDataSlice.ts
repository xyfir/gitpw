import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { BootFileData, RootState } from '../types';

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

export const selectBootFileData = (
  s: RootState,
): ReturnType<typeof bootFileDataSlice.reducer> => s.bootFileData;

export const selectNonNullableBootFileData = (
  s: RootState,
): NonNullable<ReturnType<typeof bootFileDataSlice.reducer>> =>
  s.bootFileData as NonNullable<BootFileData>;
