import { StyleSheet, TextInput, Button, Text, View } from 'react-native';
import { BootFileData } from '../types';
import { BootFile } from '../utils/BootFile';
import React from 'react';

export function HomeScreen(): JSX.Element | null {
  const [configPasscode, setConfigPasscode] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [bootFileData, setBootFileData] = React.useState<BootFileData>();
  const [passcode, setPasscode] = React.useState<string>();

  function onDisablePasscode(): void {
    const data: BootFileData = {
      ...bootFileData,
      firstLaunch: false,
    } as BootFileData;
    BootFile.setData(data);
    setAuthenticated(true);
    setBootFileData(data);
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
    BootFile.setData(data);
    setAuthenticated(true);
    setBootFileData(data);
  }

  function onUnlock(): void {
    //
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
      />

      <Button onPress={onDisablePasscode} title="Cancel" />
      <Button onPress={onSavePasscode} title="Save" />
    </View>
  ) : authenticated ? (
    <View style={styles.root}>
      <Text>Welcome!</Text>
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
        value={passcode}
      />

      <Button onPress={onUnlock} title="Unlock" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
});
