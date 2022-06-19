import { StackNavigatorScreenProps } from '../types';
import { Alert, Text, View } from 'react-native';
import { loadAuthedState } from '../utils/loadAuthedState';
import { TrTextInput } from '../components/TrTextInput';
import { StorageFile } from '../utils/StorageFile';
import { useTheme } from '../hooks/useTheme';
import { TrButton } from '../components/TrButton';
import React from 'react';

/**
 * This can be the first screen a user sees when they open the app if they've
 *  configured a passcode. They will be required to enter in their passcode
 *  correctly to decrypt `/storage.json` and access their data.
 *
 * @see StorageFile
 */
export function EnterPasscodeScreen({
  navigation,
}: StackNavigatorScreenProps<'EnterPasscodeScreen'>): JSX.Element {
  const [passcode, setPasscode] = React.useState('');
  const theme = useTheme('EnterPasscodeScreen');

  function onUnlock(): void {
    StorageFile.unlock(passcode)
      .then(() => {
        loadAuthedState();
        navigation.replace('HomeScreen');
      })
      .catch(() => Alert.alert('Incorrect passcode!'));
  }

  return (
    <View style={theme.root}>
      <Text style={theme.text}>Passcode</Text>
      <Text style={theme.text}>Enter your passcode</Text>

      <TrTextInput
        onSubmitEditing={onUnlock}
        returnKeyType="done"
        onChangeText={setPasscode}
        keyboardType="numeric"
        placeholder="hunter2"
        value={passcode}
      />

      <TrButton onPress={onUnlock} title="Unlock" />
    </View>
  );
}
