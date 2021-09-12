import { useColorScheme } from 'react-native';

/**
 * Is the device using a dark theme?
 */
export function useIsDark(): boolean {
  return useColorScheme() == 'dark';
}
