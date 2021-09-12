import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Font from 'expo-font';
import React from 'react';
import {
  Ubuntu_400Regular,
  Ubuntu_500Medium,
  Ubuntu_300Light,
  Ubuntu_700Bold,
} from '@expo-google-fonts/ubuntu';
import {
  UbuntuMono_400Regular,
  UbuntuMono_700Bold,
} from '@expo-google-fonts/ubuntu-mono';

SplashScreen.preventAutoHideAsync();

/**
 * Preload fonts/icons and hide the splash screen after
 */
export function useCachedResources(): boolean {
  const [fontsLoaded] = Font.useFonts({
    // Ubuntu Mono
    UbuntuMono_400Regular,
    UbuntuMono_700Bold,

    // Ubuntu
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_300Light,
    Ubuntu_700Bold,

    // Icons
    ...FontAwesome5.font,
  });

  React.useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  return fontsLoaded;
}
