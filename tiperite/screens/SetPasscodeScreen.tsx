import { selectNonNullableBootFileData } from '../state/bootFileDataSlice';
import { StackNavigatorScreenProps } from '../types';
import { loadAuthedState } from '../utils/loadAuthedState';
import { BootFileData } from '../types';
import { TrTextInput } from '../components/TrTextInput';
import { useSelector } from '../hooks/useSelector';
import { StorageFile } from '../utils/StorageFile';
import { Text, View } from 'react-native';
import { TrButton } from '../components/TrButton';
import { BootFile } from '../utils/BootFile';
import { useTheme } from '../hooks/useTheme';
import React from 'react';

/**
 * This is the first screen shown upon opening the app for the first time. It
 *  prompts the user to either create a passcode or continue without one.
 *
 * Creating a passcode is highly recommended as it is used in encrypting the
 *  local data.
 */
export function SetPasscodeScreen({
  navigation,
}: StackNavigatorScreenProps<'SetPasscodeScreen'>): JSX.Element {
  const [configuring, setConfiguring] = React.useState(false);
  const [passcode, setPasscode] = React.useState('');
  const bootFileData = useSelector(selectNonNullableBootFileData);
  const theme = useTheme('SetPasscodeScreen');

  function onSkip(): void {
    const data: BootFileData = {
      ...bootFileData,
      firstLaunch: false,
    } as BootFileData;

    BootFile.setData(data)
      .then(() => StorageFile.unlock(''))
      .then(() => {
        loadAuthedState(data);
        navigation.replace('HomeScreen');
      });
  }

  function onSave(): void {
    const data: BootFileData = {
      ...bootFileData,
      hasDevicePassword: true,
      passwordLength: passcode.length,
      passwordType: 'number',
      firstLaunch: false,
    } as BootFileData;

    BootFile.setData(data)
      .then(() => StorageFile.unlock(passcode))
      .then(() => {
        loadAuthedState(data);
        navigation.replace('HomeScreen');
      });
  }

  return configuring ? (
    <View style={theme.root}>
      <Text style={theme.text}>Passcode</Text>
      <Text style={theme.text}>Configure your passcode</Text>

      <TrTextInput
        onSubmitEditing={onSave}
        returnKeyType="done"
        onChangeText={setPasscode}
        keyboardType="numeric"
        placeholder="hunter2"
        value={passcode}
      />

      <TrButton onPress={onSkip} title="Cancel" />
      <TrButton onPress={onSave} title="Save" />
    </View>
  ) : (
    <View style={theme.root}>
      <Text style={theme.text}>Passcode</Text>
      <Text style={theme.text}>Would you like to set a device passcode?</Text>

      <TrButton onPress={onSkip} title="No" />
      <TrButton onPress={() => setConfiguring(true)} title="Yes" />
    </View>
  );
}
