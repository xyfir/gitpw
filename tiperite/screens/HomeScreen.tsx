import { TextInput, Button, Alert, Text, View } from 'react-native';
import { BootFileData } from '../types';
import { useSelector } from '../hooks/useSelector';
import { useDispatch } from '../hooks/useDispatch';
import { DeviceFile } from '../utils/DeviceFile';
import { BootFile } from '../utils/BootFile';
import { useTheme } from '../hooks/useTheme';
import { FS } from '../utils/FS';
import React from 'react';
import {
  selectDeviceFileData,
  deviceFileDataSlice,
} from '../state/deviceFileDataSlice';
import {
  selectBootFileData,
  bootFileDataSlice,
} from '../state/bootFileDataSlice';

export function HomeScreen(): JSX.Element | null {
  const [configPasscode, setConfigPasscode] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [passcode, setPasscode] = React.useState('');
  const deviceFileData = useSelector(selectDeviceFileData);
  const bootFileData = useSelector(selectBootFileData);
  const dispatch = useDispatch();
  const theme = useTheme('HomeScreen');

  function onDisablePasscode(): void {
    const data: BootFileData = {
      ...bootFileData,
      firstLaunch: false,
    } as BootFileData;

    BootFile.setData(data)
      .then(() => DeviceFile.unlock(''))
      .then(() => {
        dispatch(deviceFileDataSlice.actions.set(DeviceFile.getData()));
        dispatch(bootFileDataSlice.actions.set(data));

        setConfigPasscode(false);
        setAuthenticated(true);
      });
  }

  function onEnablePasscode(): void {
    setConfigPasscode(true);
  }

  function onSavePasscode(): void {
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

        setConfigPasscode(false);
        setAuthenticated(true);
      });
  }

  function onUnlock(): void {
    DeviceFile.unlock(passcode)
      .then(() => {
        dispatch(deviceFileDataSlice.actions.set(DeviceFile.getData()));

        setAuthenticated(true);
      })
      .catch(() => Alert.alert('Incorrect passcode!'));
  }

  function onReset(): void {
    FS.unlink('/device.json')
      .then(() => console.log('reset device'))
      .catch((e) => console.error('reset device', e));
    FS.unlink('/boot.json')
      .then(() => console.log('reset boot'))
      .catch((e) => console.error('reset boot', e));
  }

  React.useEffect(() => {
    BootFile.getData().then((data) => {
      // Skip 'unlock' screen because the user has configured a no-pass login
      if (!data.hasDevicePassword && !data.firstLaunch) {
        DeviceFile.unlock('').then(() => {
          dispatch(deviceFileDataSlice.actions.set(DeviceFile.getData()));
          dispatch(bootFileDataSlice.actions.set(data));

          setConfigPasscode(false);
          setAuthenticated(true);
        });
      }
      // Load boot file as normal
      else {
        dispatch(bootFileDataSlice.actions.set(data));
      }
    });
  }, []);

  return !bootFileData ? null : configPasscode ? (
    <View style={theme.root}>
      <Text style={theme.text}>Passcode</Text>
      <Text style={theme.text}>Configure your passcode</Text>

      <TextInput
        onSubmitEditing={onSavePasscode}
        returnKeyType="done"
        onChangeText={setPasscode}
        keyboardType="numeric"
        style={theme.textInput}
        value={passcode}
      />

      <Button onPress={onDisablePasscode} title="Cancel" />
      <Button onPress={onSavePasscode} title="Save" />
    </View>
  ) : authenticated ? (
    <View style={theme.root}>
      <Text style={theme.text}>Welcome!</Text>

      <Button onPress={onReset} title="Reset" />

      <Text style={theme.text}>{JSON.stringify(bootFileData, null, 2)}</Text>

      <Text style={theme.text}>{JSON.stringify(deviceFileData, null, 2)}</Text>
    </View>
  ) : bootFileData.firstLaunch ? (
    <View style={theme.root}>
      <Text style={theme.text}>Passcode</Text>
      <Text style={theme.text}>Would you like to set a device passcode?</Text>

      <Button onPress={onDisablePasscode} title="No" />
      <Button onPress={onEnablePasscode} title="Yes" />
    </View>
  ) : (
    <View style={theme.root}>
      <Text style={theme.text}>Passcode</Text>
      <Text style={theme.text}>Enter your passcode</Text>

      <TextInput
        onSubmitEditing={onSavePasscode}
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
