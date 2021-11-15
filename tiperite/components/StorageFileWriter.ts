import { selectCredentials } from '../state/credentialsSlice';
import { selectWorkspaces } from '../state/workspacesSlice';
import { selectConfig } from '../state/configSlice';
import { useSelector } from '../hooks/useSelector';
import { StorageFile } from '../utils/StorageFile';
import React from 'react';

/**
 * Listen for state change to write to storage. Throttle to 1 write per 250ms.
 */
export function StorageFileWriter(): null {
  const credentials = useSelector(selectCredentials);
  const workspaces = useSelector(selectWorkspaces);
  const timeout = React.useRef<NodeJS.Timeout>();
  const config = useSelector(selectConfig);

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
