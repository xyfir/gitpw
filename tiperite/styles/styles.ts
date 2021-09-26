import { NavigationContainerStyles } from './common/NavigationContainerStyles';
import { HomeScreenStyles } from './screens/HomeScreenStyles';

export const styles = {
  ...HomeScreenStyles,
  ...NavigationContainerStyles,
};

export type RootStyles = typeof styles;
