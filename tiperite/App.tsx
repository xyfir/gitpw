import 'react-native-gesture-handler';
import { Buffer } from 'buffer';

// @ts-ignore
global.Buffer = Buffer;

import { Provider as ReduxProvider } from 'react-redux';
import { useCachedResources } from './hooks/useCachedResources';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebExecutorHost } from './components/WebExecutorHost';
import { Navigation } from './navigation/Navigation';
import { useIsDark } from './hooks/useIsDark';
import { StatusBar } from 'expo-status-bar';
import { store } from './state/store';
import React from 'react';

export default function App(): JSX.Element | null {
  const [webReady, setWebReady] = React.useState(false);
  const resourcesReady = useCachedResources();
  const dark = useIsDark();

  return resourcesReady ? (
    <React.StrictMode>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <StatusBar animated style={dark ? 'light' : 'dark'} />

          {webReady && <Navigation />}

          <WebExecutorHost onLoadEnd={() => setWebReady(true)} />
        </SafeAreaProvider>
      </ReduxProvider>
    </React.StrictMode>
  ) : null;
}
