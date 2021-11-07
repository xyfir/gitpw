import { storageFileDataSlice } from './storageFileDataSlice';
import { bootFileDataSlice } from './bootFileDataSlice';
import { workspacesSlice } from './workspacesSlice';
import { configureStore } from '@reduxjs/toolkit';
import { configSlice } from './configSlice';
import { themeSlice } from './themeSlice';

export const store = configureStore({
  reducer: {
    storageFileData: storageFileDataSlice.reducer,
    bootFileData: bootFileDataSlice.reducer,
    workspaces: workspacesSlice.reducer,
    config: configSlice.reducer,
    theme: themeSlice.reducer,
  },
});
