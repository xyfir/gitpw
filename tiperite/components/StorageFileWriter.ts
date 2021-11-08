import { selectWorkspaces } from '../state/workspacesSlice';
import { selectConfig } from '../state/configSlice';
import { useSelector } from '../hooks/useSelector';
import { StorageFile } from '../utils/StorageFile';
import React from 'react';

export function StorageFileWriter(): null {
  const workspaces = useSelector(selectWorkspaces);
  const config = useSelector(selectConfig);

  React.useEffect(() => {
    if (!workspaces) return;

    const data = StorageFile.getData();

    StorageFile.setData({
      ...data,
      workspaces: Object.values(workspaces.byId),
      config,
    });
  }, [workspaces, config]);

  return null;
}
