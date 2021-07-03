/* eslint-disable */

import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native';
import * as React from 'react';

export default function TabOneScreen() {
  function onPress() {}

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
