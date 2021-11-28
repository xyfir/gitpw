import { selectCredentials } from '../state/credentialsSlice';
import { selectWorkspaces } from '../state/workspacesSlice';
import { useTrSelector } from '../hooks/useTrSelector';
import { selectConfig } from '../state/configSlice';
import { StorageFile } from '../utils/StorageFile';
import React from 'react';

/**
 * Listen for state change to write to storage. Throttle to 1 write per 250ms.
 */
export function StorageFileWriter(): null {
  const credentials = useTrSelector(selectCredentials);
  const workspaces = useTrSelector(selectWorkspaces);
  const timeout = React.useRef<NodeJS.Timeout>();
  const config = useTrSelector(selectConfig);

  React.useEffect(() => {
    if (!credentials || !workspaces) return;
    clearTimeout(timeout.current as NodeJS.Timeout);

    timeout.current = setTimeout(() => {
      const data = StorageFile.getData();

      StorageFile.setData({
        ...data,
        credentials: Object.values(credentials.byId),
        workspaces: Object.values(workspaces.byId),
        config,
      });
    }, 250);
  }, [credentials, workspaces, config]);

  return null;
}
