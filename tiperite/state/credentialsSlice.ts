import { CredentialsState, Credential, RootState } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type State = CredentialsState | null;

export const credentialsSlice = createSlice({
  initialState: null as State,
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

export const selectCredentials = (s: RootState): State => s.credentials;

export const selectNonNullableCredentials = (
  s: RootState,
): NonNullable<State> => s.credentials as NonNullable<State>;
