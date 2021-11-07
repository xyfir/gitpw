import { selectNonNullableBootFileData } from '../state/bootFileDataSlice';
import { useSelector } from '../hooks/useSelector';
import { Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import React from 'react';

/**
 * This is the first screen the user sees after entering their passcode (or
 *  it's the first visible screen upon opening the app if they don't have a
 *  passcode).
 */
export function HomeScreen(): JSX.Element {
  const bootFileData = useSelector(selectNonNullableBootFileData);
  const theme = useTheme('HomeScreen');

  return (
    <View style={theme.root}>
      <Text style={theme.text}>Welcome!</Text>

      <Text style={theme.text}>{JSON.stringify(bootFileData, null, 2)}</Text>
    </View>
  );
}
