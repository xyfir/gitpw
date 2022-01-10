import { EncryptedDocMeta, DocHeaders, JSONString } from '../types';
import { docsSlice } from '../state/docsSlice';
import { TrCrypto } from './TrCrypto';
import { store } from '../state/store';
import { FS } from './FS';

let allDocsLoaded = false;

/**
 * Ensures that all documents are loaded into the store and not just the most
 *  recently modified ones.
 */
export async function ensureAllDocsLoaded(): Promise<void> {
  if (allDocsLoaded) return;
  allDocsLoaded = true;

  const { workspaces, docs } = store.getState();
  if (!workspaces || !docs) return;

  for (const workspaceId of workspaces.allIds) {
    const workspace = workspaces.byId[workspaceId];

    // Get documents in workspace
    const dir = `/workspaces/${workspaceId}/docs`;
    await FS.readdir(dir)
      .then((files) => {
        // Read each file not already in state
        return Promise.all(
          files
            .filter((file) => file.endsWith('.meta.json'))
            .filter((file) => {
              const docId = file.split('.')[0];
              return docs ? !docs.byId[docId] : true;
            })
            .map((file) => {
              return FS.readJSON<EncryptedDocMeta>(
                `${dir}/${file}`,
              ) as Promise<EncryptedDocMeta>;
            }),
        );
      })
      .then((docs) => {
        // Build DecryptedDocMeta to load into state
        return Promise.all(
          docs.map((doc) => {
            return TrCrypto.decrypt(doc.headers, workspace.keys).then(
              (headers): [EncryptedDocMeta, DocHeaders] => [
                doc,
                JSON.parse(headers as JSONString) as DocHeaders,
              ],
            );
          }),
        );
      })
      .then((docs) => {
        store.dispatch(
          docsSlice.actions.load(
            docs.map(([meta, headers]) => ({ workspaceId, headers, meta })),
          ),
        );
      })
      .catch(console.error);
  }
}
