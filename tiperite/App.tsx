import 'react-native-gesture-handler';
import { Buffer } from 'buffer';

// @ts-ignore
global.Buffer = Buffer;

import { useCachedResources } from './hooks/useCachedResources';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebExecutorHost } from './components/WebExecutorHost';
import { useColorScheme } from './hooks/useColorScheme';
import { Navigation } from './navigation/Navigation';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function App(): JSX.Element | null {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  return isLoadingComplete ? (
    <SafeAreaProvider>
      <StatusBar />
      <Navigation colorScheme={colorScheme} />
      <WebExecutorHost />
    </SafeAreaProvider>
  ) : null;
}
