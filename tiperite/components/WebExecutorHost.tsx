import { WebViewProps, WebView } from 'react-native-webview';
import { WebExecutorHTML } from '../constants/WebExecutorHTML';
import { WebExecutor } from '../utils/WebExecutor';
import { StyleSheet } from 'react-native';
import React from 'react';

/**
 * This component hosts a hidden embedded web browser for `WebExecutor`.
 *
 * @see WebExecutor
 */
export function WebExecutorHost({
  onLoadEnd,
}: {
  onLoadEnd: WebViewProps['onLoadEnd'];
}): JSX.Element {
  // originWhitelist and baseUrl are required for IndexedDB to work
  // Android requires file:/// to give us an actual file host url
  return (
    <WebView
      originWhitelist={['*']}
      containerStyle={styles.root}
      onMessage={(e) => WebExecutor.emit(e)}
      onLoadEnd={onLoadEnd}
      source={{ baseUrl: 'file:///', html: WebExecutorHTML }}
      style={styles.root}
      ref={(r) => (WebExecutor.webview = r as WebView)}
    />
  );
}

const styles = StyleSheet.create({
  root: { display: 'none' },
});
