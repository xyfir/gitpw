import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState, TiperiteConfig } from '../types';

export const configSlice = createSlice({
  initialState: {} as TiperiteConfig,
  reducers: {
    set(_, action: PayloadAction<TiperiteConfig>): TiperiteConfig {
      return action.payload;
    },
  },
  name: 'config',
});

export const selectConfig = (
  s: RootState,
): ReturnType<typeof configSlice.reducer> => s.config;
