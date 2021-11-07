import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TiperiteConfig } from '../types';

export const configSlice = createSlice({
  initialState: {} as TiperiteConfig,
  reducers: {
    set(_, action: PayloadAction<TiperiteConfig>): TiperiteConfig {
      return action.payload;
    },
  },
  name: 'config',
});
