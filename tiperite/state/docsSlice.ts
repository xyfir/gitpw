import { RootState, DecryptedDocMeta, DocsState, DocID } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const nullError = Error('docsSlice null');

type State = DocsState | null;

export const docsSlice = createSlice({
  initialState: null as State,
  reducers: {
    load(state, action: PayloadAction<DecryptedDocMeta[]>): DocsState {
      return {
        allIds: (state ? state.allIds : []).concat(
          action.payload.map((doc) => doc.id),
        ),
        byId: {
          ...(state ? state.byId : {}),
          ...action.payload.reduce((byId, doc) => {
            byId[doc.id] = doc;
            return byId;
          }, {} as DocsState['byId']),
        },
      };
    },

    /**
     * Add a new doc
     */
    add(state, action: PayloadAction<DecryptedDocMeta>): void {
      if (!state) throw nullError;
      state.allIds.push(action.payload.id);
      state.byId[action.payload.id] = action.payload;
    },

    /**
     * Update a doc
     */
    update(state, action: PayloadAction<DecryptedDocMeta>): void {
      if (!state) throw nullError;
      state.byId[action.payload.id] = action.payload;
    },

    /**
     * Delete a doc
     */
    delete(state, action: PayloadAction<DocID>): void {
      if (!state) throw nullError;
      const id = action.payload;
      state.allIds = state.allIds.filter((docId) => docId != id);
      delete state.byId[id];
    },
  },
  name: 'docs',
});

export const selectDocs = (s: RootState): State => s.docs;

export const selectNonNullableDocs = (s: RootState): NonNullable<State> =>
  s.docs as NonNullable<State>;
