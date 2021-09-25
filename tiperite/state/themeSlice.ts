import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { buildTheme } from '../utils/buildTheme';
import { RootStyles } from '../styles/styles';
import { Appearance } from 'react-native';

export const themeSlice = createSlice({
  initialState: buildTheme(Appearance.getColorScheme() == 'dark'),
  reducers: {
    /**
     * Set the entire `theme` object
     */
    set(_, action: PayloadAction<RootStyles>): RootStyles {
      return action.payload;
    },
  },
  name: 'styles',
});
