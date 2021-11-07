import { selectNonNullableStorageFileData } from '../state/storageFileDataSlice';
import { selectNonNullableBootFileData } from '../state/bootFileDataSlice';
import { useSelector } from '../hooks/useSelector';
import { Text, View } from 'react-native';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { FS } from '../utils/FS';
import React from 'react';

/**
 * This is the first screen the user sees after entering their passcode (or
 *  it's the first visible screen upon opening the app if they don't have a
 *  passcode).
 */
export function HomeScreen(): JSX.Element {
  const storageFileData = useSelector(selectNonNullableStorageFileData);
  const bootFileData = useSelector(selectNonNullableBootFileData);
  const theme = useTheme('HomeScreen');

  function onReset(): void {
    FS.unlink('/storage.json')
      .then(() => console.log('reset storage'))
      .catch((e) => console.error('reset storage', e));
    FS.unlink('/boot.json')
      .then(() => console.log('reset boot'))
      .catch((e) => console.error('reset boot', e));
  }

  return (
    <View style={theme.root}>
      <Text style={theme.text}>Welcome!</Text>

      <TrButton onPress={onReset} title="Reset" />

      <Text style={theme.text}>{JSON.stringify(bootFileData, null, 2)}</Text>

      <Text style={theme.text}>{JSON.stringify(storageFileData, null, 2)}</Text>
    </View>
  );
}
