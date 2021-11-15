import { RootState, StorageFileWorkspace, WorkspacesState } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type State = WorkspacesState | null;

export const workspacesSlice = createSlice({
  initialState: null as State,
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

export const selectWorkspaces = (s: RootState): State => s.workspaces;

export const selectNonNullableWorkspaces = (s: RootState): NonNullable<State> =>
  s.workspaces as NonNullable<State>;
