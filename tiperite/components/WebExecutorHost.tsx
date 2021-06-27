import { WebExecutorHTML } from '../constants/WebExecutorHTML';
import { WebExecutor } from '../utils/WebExecutor';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import React from 'react';

/**
 * This component hosts a hidden embedded web browser for `WebExecutor`.
 * @see WebExecutor
 */
export function WebExecutorHost(): JSX.Element {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (loaded) WebExecutor.initialize();
  }, [loaded]);

  // originWhitelist and baseUrl are required for IndexedDB to work
  return (
    <WebView
      originWhitelist={['*']}
      containerStyle={styles.root}
      onMessage={(e) => WebExecutor.emit(e)}
      onLoadEnd={() => setLoaded(true)}
      source={{ baseUrl: '/', html: WebExecutorHTML }}
      style={styles.root}
      ref={(r) => (WebExecutor.webview = r as any)}
    />
  );
}

const styles = StyleSheet.create({
  root: { display: 'none' },
});
