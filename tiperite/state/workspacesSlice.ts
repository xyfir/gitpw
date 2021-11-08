import { StorageFileWorkspace, WorkspacesState } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const workspacesSlice = createSlice({
  initialState: null as WorkspacesState | null,
  reducers: {
    initialize(
      _,
      action: PayloadAction<StorageFileWorkspace[]>,
    ): WorkspacesState {
      return {
        allIds: action.payload.map((workspace) => workspace.id),
        byId: action.payload.reduce((byId, workspace) => {
          byId[workspace.id] = workspace;
          return byId;
        }, {} as WorkspacesState['byId']),
      };
    },
  },
  name: 'workspaces',
});
