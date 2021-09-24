import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootStyles, styles } from '../styles/styles';

export const themeSlice = createSlice({
  initialState: styles,
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
