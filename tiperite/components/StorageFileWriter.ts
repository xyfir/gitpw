import { selectCredentials } from '../state/credentialsSlice';
import { selectWorkspaces } from '../state/workspacesSlice';
import { useTrSelector } from '../hooks/useTrSelector';
import { selectConfig } from '../state/configSlice';
import { StorageFile } from '../utils/StorageFile';
import { selectDocs } from '../state/docsSlice';
import React from 'react';

/**
 * Listen for state changes to write to `/storage.json`.
 *
 * Throttle to 1 write per 250ms.
 */
export function StorageFileWriter(): null {
  const credentials = useTrSelector(selectCredentials);
  const workspaces = useTrSelector(selectWorkspaces);
  const config = useTrSelector(selectConfig);
  const docs = useTrSelector(selectDocs);

  React.useEffect(() => {
    if (!credentials || !workspaces) return;

    const timeout = setTimeout(() => {
      const data = StorageFile.getData();

      StorageFile.setData({
        ...data,
        credentials: Object.values(credentials.byId),
        workspaces: Object.values(workspaces.byId),
        recentDocs: docs
          ? docs.allIds
              .slice()
              .sort((a, b) => {
                if (docs.byId[a].updatedAt > docs.byId[b].updatedAt) return -1;
                if (docs.byId[a].updatedAt < docs.byId[b].updatedAt) return 1;
                return 0;
              })
              .map((id) => ({
                workspaceId: docs.byId[id].workspaceId,
                docId: id,
              }))
              .slice(0, 15)
          : data.recentDocs,
        config,
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [credentials, workspaces, config, docs]);

  return null;
}
