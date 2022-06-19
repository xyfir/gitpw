import { Dimensions, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { html } from './html.js';
import React from 'react';

export default function App(): JSX.Element | null {
  return (
    <WebView
      mixedContentMode="always"
      originWhitelist={['*']}
      containerStyle={styles.root}
      source={{ baseUrl: 'https://github.com/', html }}
      style={styles.root}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
});
