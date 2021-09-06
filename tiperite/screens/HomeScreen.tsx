import { StyleSheet, TextInput, Button, Text, View, Alert } from 'react-native';
import { DeviceFileData, BootFileData } from '../types';
import { DeviceFile } from '../utils/DeviceFile';
import { BootFile } from '../utils/BootFile';
import { FS } from '../utils/FS';
import React from 'react';

export function HomeScreen(): JSX.Element | null {
  const [deviceFileData, setDeviceFileData] = React.useState<DeviceFileData>();
  const [configPasscode, setConfigPasscode] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [bootFileData, setBootFileData] = React.useState<BootFileData>();
  const [passcode, setPasscode] = React.useState('');

  function onDisablePasscode(): void {
    const data: BootFileData = {
      ...bootFileData,
      firstLaunch: false,
    } as BootFileData;

    BootFile.setData(data)
      .then(() => DeviceFile.unlock(passcode))
      .then(() => {
        setDeviceFileData(DeviceFile.getData());
        setBootFileData(data);
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
      passwordLength: passcode?.length,
      passwordType: 'number',
      firstLaunch: false,
    } as BootFileData;

    BootFile.setData(data)
      .then(() => DeviceFile.unlock(passcode))
      .then(() => {
        setDeviceFileData(DeviceFile.getData());
        setBootFileData(data);
        setConfigPasscode(false);
        setAuthenticated(true);
      });
  }

  function onUnlock(): void {
    DeviceFile.unlock(passcode)
      .then(() => {
        setDeviceFileData(DeviceFile.getData());
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
    BootFile.getData().then(setBootFileData);
  }, []);

  return !bootFileData ? null : configPasscode ? (
    <View style={styles.root}>
      <Text>Passcode</Text>
      <Text>Configure your passcode</Text>

      <TextInput
        onSubmitEditing={onSavePasscode}
        returnKeyType="done"
        onChangeText={setPasscode}
        keyboardType="numeric"
        value={passcode}
        style={{ backgroundColor: 'gray', width: 200 }}
      />

      <Button onPress={onDisablePasscode} title="Cancel" />
      <Button onPress={onSavePasscode} title="Save" />
    </View>
  ) : authenticated ? (
    <View style={styles.root}>
      <Text>Welcome!</Text>

      <Button onPress={onReset} title="Reset" />

      <Text>{JSON.stringify(bootFileData, null, 2)}</Text>

      <Text>{JSON.stringify(deviceFileData, null, 2)}</Text>
    </View>
  ) : bootFileData.firstLaunch ? (
    <View style={styles.root}>
      <Text>Passcode</Text>
      <Text>Would you like to set a device passcode?</Text>

      <Button onPress={onDisablePasscode} title="No" />
      <Button onPress={onEnablePasscode} title="Yes" />
    </View>
  ) : (
    <View style={styles.root}>
      <Text>Passcode</Text>
      <Text>Enter your passcode</Text>

      <TextInput
        onSubmitEditing={onSavePasscode}
        returnKeyType="done"
        onChangeText={setPasscode}
        keyboardType="numeric"
        style={{ backgroundColor: 'gray', width: 200 }}
        value={passcode}
      />

      <Button onPress={onUnlock} title="Unlock" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
