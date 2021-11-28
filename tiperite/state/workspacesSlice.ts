import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  StorageFileWorkspace,
  WorkspacesState,
  WorkspaceID,
  RootState,
} from '../types';

const nullError = Error('workspacesSlice null');

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

    /**
     * Add a new workspace
     */
    add(state, action: PayloadAction<StorageFileWorkspace>): void {
      if (!state) throw nullError;
      state.allIds.push(action.payload.id);
      state.byId[action.payload.id] = action.payload;
    },

    /**
     * Update a workspace
     */
    update(state, action: PayloadAction<StorageFileWorkspace>): void {
      if (!state) throw nullError;
      state.byId[action.payload.id] = action.payload;
    },

    /**
     * Delete a workspace
     */
    delete(state, action: PayloadAction<WorkspaceID>): void {
      if (!state) throw nullError;
      const id = action.payload;
      state.allIds = state.allIds.filter((workspaceId) => workspaceId != id);
      delete state.byId[id];
    },
  },
  name: 'workspaces',
});

export const selectWorkspaces = (s: RootState): State => s.workspaces;

export const selectNonNullableWorkspaces = (s: RootState): NonNullable<State> =>
  s.workspaces as NonNullable<State>;
