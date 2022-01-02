import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Random } from '../utils/Random';
import {
  DecryptedDocMeta,
  EncryptedDocMeta,
  WorkspaceID,
  DocHeaders,
  RootState,
  DocsState,
  DocID,
} from '../types';

const nullError = Error('docsSlice null');

type State = DocsState | null;

export const docsSlice = createSlice({
  initialState: null as State,
  reducers: {
    load(
      state,
      action: PayloadAction<{
        workspaceId: WorkspaceID;
        docs: [EncryptedDocMeta, DocHeaders][];
      }>,
    ): DocsState {
      const { workspaceId } = action.payload;
      return {
        allIds: (state ? state.allIds : []).concat(
          action.payload.docs
            .sort((a, b) => {
              if (a[0].updatedAt > b[0].updatedAt) return -1;
              if (a[0].updatedAt < b[0].updatedAt) return 1;
              return 0;
            })
            .map((doc) => doc[0].id),
        ),
        byId: {
          ...(state ? state.byId : {}),
          ...action.payload.docs.reduce((byId, doc) => {
            const meta: DecryptedDocMeta = {
              workspaceId,
              createdAt: doc[0].createdAt,
              updatedAt: doc[0].updatedAt,
              bodyPath: `/workspaces/${workspaceId}/docs/${doc[0].id}.body.json`,
              metaPath: `/workspaces/${workspaceId}/docs/${doc[0].id}.meta.json`,
              headers: doc[1],
              id: doc[0].id,
            };

            byId[doc[0].id] = meta;
            return byId;
          }, {} as DocsState['byId']),
        },
      };
    },

    /**
     * Add a new, empty doc
     */
    add(state, action: PayloadAction<WorkspaceID>): void {
      if (!state) throw nullError;

      const workspaceId = action.payload;
      const now = new Date().toISOString();
      const id = Random.uuid();

      const doc: DecryptedDocMeta = {
        workspaceId,
        createdAt: now,
        updatedAt: now,
        metaPath: `/workspaces/${workspaceId}/docs/${id}.meta.json`,
        bodyPath: `/workspaces/${workspaceId}/docs/${id}.body.json`,
        headers: { x: {} },
        id,
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
