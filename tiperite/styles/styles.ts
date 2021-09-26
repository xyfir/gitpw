import { NavigationRootStyles } from './navigation/NavigationRootStyles';
import { HomeScreenStyles } from './screens/HomeScreenStyles';

export const styles = {
  ...HomeScreenStyles,
  ...NavigationRootStyles,
};

export type RootStyles = typeof styles;
