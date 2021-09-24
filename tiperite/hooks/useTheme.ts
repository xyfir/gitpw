import { useSelector } from './useSelector';
import { RootStyles } from '../styles/styles';

export function useTheme<K extends keyof RootStyles>(key: K): RootStyles[K] {
  return useSelector((s) => s.theme[key]);
}
