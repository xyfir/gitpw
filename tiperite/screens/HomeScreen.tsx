import { StackNavigatorScreenProps } from '../types';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { View } from 'react-native';
import React from 'react';

/**
 * This is the first screen the user sees after entering their passcode (or
 *  it's the first visible screen upon opening the app if they don't have a
 *  passcode).
 */
export function HomeScreen({
  navigation,
}: StackNavigatorScreenProps<'HomeScreen'>): JSX.Element {
  const theme = useTheme('HomeScreen');

  function onAddWorkspace(): void {
    navigation.navigate('AddWorkspaceScreen');
  }

  return (
    <View style={theme.root}>
      <TrButton onPress={onAddWorkspace} title="Add Workspace" />
    </View>
  );
}
