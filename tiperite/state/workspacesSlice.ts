import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { WorkspacesState } from '../types';

export const workspacesSlice = createSlice({
  initialState: null as WorkspacesState | null,
  reducers: {
    set(_, action: PayloadAction<WorkspacesState>): WorkspacesState {
      return action.payload;
    },
  },
  name: 'workspaces',
});
