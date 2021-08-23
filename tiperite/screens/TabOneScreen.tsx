/* eslint-disable */

import { StyleSheet, View } from 'react-native';
import { WebExecutor } from '../utils/WebExecutor';
import { KeyDeriver } from '../utils/KeyDeriver';
import { Button } from 'react-native';
import * as React from 'react';
import { AES } from '../utils/AES';

export default function TabOneScreen() {
  async function onPress() {
    try {
      const salt = await KeyDeriver.generateSalt();
      console.log('salt', salt);
      const itr = KeyDeriver.generateIterations();
      console.log('itr', itr);

      const key = await KeyDeriver.deriveKey('password', salt, itr);
      const keyHex = Buffer.from(key.split(',')[1], 'base64').toString('hex');
      console.log('keyHex', keyHex);

      const ciphertext = await AES.encrypt(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        keyHex,
      );
      console.log('ciphertext', ciphertext);

      const decryptedText = await AES.decrypt(ciphertext, keyHex);
      console.log('decryptedText', decryptedText);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
      <Button onPress={onPress} title="Press" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
