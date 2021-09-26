import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ThemeBuilder } from '../utils/ThemeBuilder';
import { RootStyles } from '../styles/styles';

export const themeSlice = createSlice({
  initialState: ThemeBuilder.build(),
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
