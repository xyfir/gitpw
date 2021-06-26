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

  return (
    <WebView
      containerStyle={styles.root}
      onMessage={(e) => WebExecutor.emit(e)}
      onLoadEnd={() => setLoaded(true)}
      source={{ html: WebExecutorHTML }}
      style={styles.root}
      // @ts-ignore
      ref={(r) => (WebExecutor.webview = r)}
    />
  );
}

const styles = StyleSheet.create({
  root: { display: 'none' },
});
