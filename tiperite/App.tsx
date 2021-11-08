import 'react-native-gesture-handler';
import { Buffer } from 'buffer';

// @ts-ignore
global.Buffer = Buffer;

import { Provider as ReduxProvider } from 'react-redux';
import { StorageFileWriter } from './components/StorageFileWriter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationRoot } from './navigation/NavigationRoot';
import { themeSlice } from './state/themeSlice';
import { useIsDark } from './hooks/useIsDark';
import { StatusBar } from 'expo-status-bar';
import { store } from './state/store';
import React from 'react';

export default function App(): JSX.Element | null {
  const isDark = useIsDark();

  // Toggle dark theme
  React.useEffect(() => {
    store.dispatch(themeSlice.actions.build({ isDark }));
  }, [isDark]);

  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <StatusBar animated style={isDark ? 'light' : 'dark'} />

        <NavigationRoot />

        <StorageFileWriter />
      </SafeAreaProvider>
    </ReduxProvider>
  );
}
