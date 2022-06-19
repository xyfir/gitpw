import { bootFileDataSlice } from './bootFileDataSlice';
import { credentialsSlice } from './credentialsSlice';
import { workspacesSlice } from './workspacesSlice';
import { configureStore } from '@reduxjs/toolkit';
import { configSlice } from './configSlice';
import { themeSlice } from './themeSlice';
import { docsSlice } from './docsSlice';

export const store = configureStore({
  reducer: {
    bootFileData: bootFileDataSlice.reducer,
    credentials: credentialsSlice.reducer,
    workspaces: workspacesSlice.reducer,
    config: configSlice.reducer,
    theme: themeSlice.reducer,
    docs: docsSlice.reducer,
  },
});
