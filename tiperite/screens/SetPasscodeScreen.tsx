import { StackNavigatorScreenProps } from '../types';
import { deviceFileDataSlice } from '../state/deviceFileDataSlice';
import { BootFileData } from '../types';
import { TrTextInput } from '../components/TrTextInput';
import { useSelector } from '../hooks/useSelector';
import { useDispatch } from '../hooks/useDispatch';
import { DeviceFile } from '../utils/DeviceFile';
import { Text, View } from 'react-native';
import { TrButton } from '../components/TrButton';
import { BootFile } from '../utils/BootFile';
import { useTheme } from '../hooks/useTheme';
import React from 'react';
import {
  selectNonNullableBootFileData,
  bootFileDataSlice,
} from '../state/bootFileDataSlice';

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
  const dispatch = useDispatch();
  const theme = useTheme('SetPasscodeScreen');

  function onSkip(): void {
    const data: BootFileData = {
      ...bootFileData,
      firstLaunch: false,
    } as BootFileData;

    BootFile.setData(data)
      .then(() => DeviceFile.unlock(''))
      .then(() => {
        dispatch(deviceFileDataSlice.actions.set(DeviceFile.getData()));
        dispatch(bootFileDataSlice.actions.set(data));
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
      .then(() => DeviceFile.unlock(passcode))
      .then(() => {
        dispatch(deviceFileDataSlice.actions.set(DeviceFile.getData()));
        dispatch(bootFileDataSlice.actions.set(data));
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
