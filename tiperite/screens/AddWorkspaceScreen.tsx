import { StackNavigatorScreenProps } from '../types';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { View } from 'react-native';
import React from 'react';
import { TrTextInput } from '../components/TrTextInput';

/**
 * Provide the form that allows the user to add a new workspace
 */
export function AddWorkspaceScreen({
  navigation,
}: StackNavigatorScreenProps<'AddWorkspaceScreen'>): JSX.Element {
  const [name, setName] = React.useState('');
  const theme = useTheme('AddWorkspaceScreen');

  return (
    <View style={theme.root}>
      <TrTextInput
        returnKeyType="next"
        onChangeText={setName}
        placeholder="My Workspace"
        value={name}
      />
    </View>
  );
}
