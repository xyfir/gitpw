import { useTrSelector } from './useTrSelector';
import { RootStyles } from '../styles/styles';

export function useTheme<K extends keyof RootStyles>(key: K): RootStyles[K] {
  return useTrSelector((s) => s.theme[key]);
}
