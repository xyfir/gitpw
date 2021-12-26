import { RootState, DecryptedDocMeta, DocsState, DocID } from '../types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Random } from '../utils/Random';

const nullError = Error('docsSlice null');

type State = DocsState | null;

export const docsSlice = createSlice({
  initialState: null as State,
  reducers: {
    load(state, action: PayloadAction<DecryptedDocMeta[]>): DocsState {
      return {
        allIds: (state ? state.allIds : []).concat(
          action.payload
            .sort((a, b) => {
              if (a.updatedAt > b.updatedAt) return -1;
              if (a.updatedAt < b.updatedAt) return 1;
              return 0;
            })
            .map((doc) => doc.id),
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
     * Add a new, empty doc
     */
    add(state): void {
      if (!state) throw nullError;

      const now = new Date().toISOString();
      const doc: DecryptedDocMeta = {
        createdAt: now,
        updatedAt: now,
        headers: { x: {} },
        id: Random.uuid(),
      };

      state.allIds.push(doc.id);
      state.byId[doc.id] = doc;
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
