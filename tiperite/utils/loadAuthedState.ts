import { bootFileDataSlice } from '../state/bootFileDataSlice';
import { workspacesSlice } from '../state/workspacesSlice';
import { BootFileData } from '../types';
import { StorageFile } from './StorageFile';
import { configSlice } from '../state/configSlice';
import { store } from '../state/store';

/**
 * Loads the authed state into Redux from the storage file after it's unlocked
 */
export function loadAuthedState(bootFileData?: BootFileData): void {
  // Load data from the storage file into state
  // Note that the dispatch order matters due to how StorageFileWriter works
  const storageFileData = StorageFile.getData();
  store.dispatch(configSlice.actions.set(storageFileData.config));
  store.dispatch(
    workspacesSlice.actions.initialize(storageFileData.workspaces),
  );

  // Load bootFileData into state
  if (bootFileData) {
    store.dispatch(bootFileDataSlice.actions.set(bootFileData));
  }
}
