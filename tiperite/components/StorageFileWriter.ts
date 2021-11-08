import { selectCredentials } from '../state/credentialsSlice';
import { selectWorkspaces } from '../state/workspacesSlice';
import { selectConfig } from '../state/configSlice';
import { useSelector } from '../hooks/useSelector';
import { StorageFile } from '../utils/StorageFile';
import React from 'react';

export function StorageFileWriter(): null {
  const credentials = useSelector(selectCredentials);
  const workspaces = useSelector(selectWorkspaces);
  const config = useSelector(selectConfig);

  React.useEffect(() => {
    if (!credentials || !workspaces) return;

    const data = StorageFile.getData();

    StorageFile.setData({
      ...data,
      credentials: Object.values(credentials.byId),
      workspaces: Object.values(workspaces.byId),
      config,
    });
  }, [credentials, workspaces, config]);

  return null;
}
