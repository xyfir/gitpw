import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StorageFileData, RootState } from '../types';

export const storageFileDataSlice = createSlice({
  initialState: null as StorageFileData | null,
  reducers: {
    /**
     * Set the entire `storageFileData` object
     */
    set(_, action: PayloadAction<StorageFileData>): StorageFileData {
      return action.payload;
    },
  },
  name: 'storageFileData',
});

export const selectStorageFileData = (
  s: RootState,
): ReturnType<typeof storageFileDataSlice.reducer> => s.storageFileData;

export const selectNonNullableStorageFileData = (
  s: RootState,
): NonNullable<ReturnType<typeof storageFileDataSlice.reducer>> =>
  s.storageFileData as NonNullable<StorageFileData>;
