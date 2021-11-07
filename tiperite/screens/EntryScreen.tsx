import { StackNavigatorScreenProps } from '../types';
import { storageFileDataSlice } from '../state/storageFileDataSlice';
import { bootFileDataSlice } from '../state/bootFileDataSlice';
import { useDispatch } from '../hooks/useDispatch';
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
  const dispatch = useDispatch();

  React.useEffect(() => {
    BootFile.getData()
      .then((data) => {
        // Skip 'unlock' screen because the user has configured a no-pass login
        if (!data.hasDevicePassword && !data.firstLaunch) {
          StorageFile.unlock('').then(() => {
            dispatch(storageFileDataSlice.actions.set(StorageFile.getData()));
            dispatch(bootFileDataSlice.actions.set(data));
            navigation.replace('HomeScreen');
          });
        }
        // Let the user configure (or skip configuring) a passcode
        else if (data.firstLaunch) {
          dispatch(bootFileDataSlice.actions.set(data));
          navigation.replace('SetPasscodeScreen');
        }
        // Make user enter a passcode before accessing the app
        else {
          dispatch(bootFileDataSlice.actions.set(data));
          navigation.replace('EnterPasscodeScreen');
        }
      })
      .catch(console.error);
  }, []);

  return null;
}
