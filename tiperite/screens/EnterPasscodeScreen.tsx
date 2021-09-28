import { TextInput, Button, Alert, Text, View } from 'react-native';
import { StackNavigatorScreenProps } from '../types';
import { deviceFileDataSlice } from '../state/deviceFileDataSlice';
import { useDispatch } from '../hooks/useDispatch';
import { DeviceFile } from '../utils/DeviceFile';
import { useTheme } from '../hooks/useTheme';
import React from 'react';

/**
 * This can be the first screen a user sees when they open the app if they've
 *  configured a passcode. They will be required to enter in their passcode
 *  correctly to decrypt `/device.json` and access their data.
 *
 * @see DeviceFile
 */
export function EnterPasscodeScreen({
  navigation,
}: StackNavigatorScreenProps<'EnterPasscodeScreen'>): JSX.Element {
  const [passcode, setPasscode] = React.useState('');
  const dispatch = useDispatch();
  const theme = useTheme('EnterPasscodeScreen');

  function onUnlock(): void {
    DeviceFile.unlock(passcode)
      .then(() => {
        dispatch(deviceFileDataSlice.actions.set(DeviceFile.getData()));
        navigation.replace('HomeScreen');
      })
      .catch(() => Alert.alert('Incorrect passcode!'));
  }

  return (
    <View style={theme.root}>
      <Text style={theme.text}>Passcode</Text>
      <Text style={theme.text}>Enter your passcode</Text>

      <TextInput
        onSubmitEditing={onUnlock}
        returnKeyType="done"
        onChangeText={setPasscode}
        keyboardType="numeric"
        style={theme.textInput}
        value={passcode}
      />

      <Button onPress={onUnlock} title="Unlock" />
    </View>
  );
}
