import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Random } from '../utils/Random';
import {
  CredentialsState,
  CredentialID,
  Credential,
  RootState,
} from '../types';

type State = CredentialsState | null;

const nullError = Error('credentialsSlice null');

export const credentialsSlice = createSlice({
  initialState: null as State,
  reducers: {
    /**
     * Initialize the state
     */
    initialize(_, action: PayloadAction<Credential[]>): CredentialsState {
      return {
        allIds: action.payload.map((c) => c.id),
        byId: action.payload.reduce((byId, c) => {
          byId[c.id] = c;
          return byId;
        }, {} as CredentialsState['byId']),
      };
    },

    /**
     * Add a new credential
     */
    add(state, action: PayloadAction<Omit<Credential, 'id'>>): void {
      if (!state) throw nullError;
      const credential: Credential = {
        ...action.payload,
        id: Random.uuid(),
      };
      state.allIds.push(credential.id);
      state.byId[credential.id] = credential;
    },

    /**
     * Update a credential
     */
    update(state, action: PayloadAction<Credential>): void {
      if (!state) throw nullError;
      state.byId[action.payload.id] = action.payload;
    },

    /**
     * Delete a credential
     */
    delete(state, action: PayloadAction<CredentialID>): void {
      if (!state) throw nullError;
      const id = action.payload;
      state.allIds = state.allIds.filter((credentialId) => credentialId != id);
      delete state.byId[id];
    },
  },
  name: 'credentials',
});

export const selectCredentials = (s: RootState): State => s.credentials;

export const selectNonNullableCredentials = (
  s: RootState,
): NonNullable<State> => s.credentials as NonNullable<State>;
