import { StackNavigatorScreenProps } from '../types';
import { bootFileDataSlice } from '../state/bootFileDataSlice';
import { loadAuthedState } from '../utils/loadAuthedState';
import { useTrDispatch } from '../hooks/useTrDispatch';
import { StorageFile } from '../utils/StorageFile';
import { BootFile } from '../utils/BootFile';
import React from 'react';

/**
 * This is the initial (invisible) screen that loads `/boot.json` and determines
 *  what the first visible screen needs to be.
 */
export function EntryScreen({
  navigation,
}: StackNavigatorScreenProps<'EntryScreen'>): null {
  const dispatch = useTrDispatch();

  React.useEffect(() => {
    BootFile.getData()
      .then((bootFileData) => {
        // Skip 'unlock' screen because the user has configured a no-pass login
        if (!bootFileData.hasDevicePassword && !bootFileData.firstLaunch) {
          StorageFile.unlock('').then(() => {
            loadAuthedState(bootFileData);
            navigation.replace('HomeScreen');
          });
        }
        // Let the user configure (or skip configuring) a passcode
        else if (bootFileData.firstLaunch) {
          dispatch(bootFileDataSlice.actions.set(bootFileData));
          navigation.replace('SetPasscodeScreen');
        }
        // Make user enter a passcode before accessing the app
        else {
          dispatch(bootFileDataSlice.actions.set(bootFileData));
          navigation.replace('EnterPasscodeScreen');
        }
      })
      .catch(console.error);
  }, []);

  return null;
}
