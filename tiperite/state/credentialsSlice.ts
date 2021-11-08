import { CredentialsState, Credential, RootState } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const credentialsSlice = createSlice({
  initialState: null as CredentialsState | null,
  reducers: {
    initialize(_, action: PayloadAction<Credential[]>): CredentialsState {
      return {
        allIds: action.payload.map((c) => c.id),
        byId: action.payload.reduce((byId, c) => {
          byId[c.id] = c;
          return byId;
        }, {} as CredentialsState['byId']),
      };
    },
  },
  name: 'credentials',
});

export const selectCredentials = (
  s: RootState,
): ReturnType<typeof credentialsSlice.reducer> => s.credentials;
