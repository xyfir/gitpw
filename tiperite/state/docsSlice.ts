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

type LoadPayloadAction = {
  workspaceId: WorkspaceID;
  headers: DocHeaders;
  meta: EncryptedDocMeta;
}[];

export const docsSlice = createSlice({
  initialState: null as State,
  reducers: {
    /**
     * Load new docs into the store
     */
    load(state, action: PayloadAction<LoadPayloadAction>): DocsState {
      return {
        allIds: (state ? state.allIds : []).concat(
          action.payload
            .sort((a, b) => {
              if (a.meta.updatedAt > b.meta.updatedAt) return -1;
              if (a.meta.updatedAt < b.meta.updatedAt) return 1;
              return 0;
            })
            .map((doc) => doc.meta.id),
        ),
        byId: {
          ...(state ? state.byId : {}),
          ...action.payload.reduce((byId, doc) => {
            const meta: DecryptedDocMeta = {
              workspaceId: doc.workspaceId,
              createdAt: doc.meta.createdAt,
              updatedAt: doc.meta.updatedAt,
              bodyPath: `/workspaces/${doc.workspaceId}/docs/${doc.meta.id}.body.json`,
              metaPath: `/workspaces/${doc.workspaceId}/docs/${doc.meta.id}.meta.json`,
              headers: doc.headers,
              id: doc.meta.id,
            };

            byId[doc.meta.id] = meta;
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

    /**
     * Delete workspace
     */
    deleteWorkspace(state, action: PayloadAction<WorkspaceID>): void {
      if (!state) throw nullError;

      const deletedDocIds: DocID[] = [];
      const workspaceId = action.payload;

      for (const docId of state.allIds) {
        if (state.byId[docId].workspaceId == workspaceId) {
          deletedDocIds.push(docId);
          delete state.byId[docId];
        }
      }
      state.allIds = state.allIds.filter(
        (docId) => !deletedDocIds.includes(docId),
      );
    },
  },
  name: 'docs',
});

export const selectDocs = (s: RootState): State => s.docs;

export const selectNonNullableDocs = (s: RootState): NonNullable<State> =>
  s.docs as NonNullable<State>;
