import { EnterPasscodeScreenStyles } from './screens/EnterPasscodeScreenStyles';
import { SetPasscodeScreenStyles } from './screens/SetPasscodeScreenStyles';
import { NavigationRootStyles } from './navigation/NavigationRootStyles';
import { HomeScreenStyles } from './screens/HomeScreenStyles';

export const styles = {
  ...EnterPasscodeScreenStyles,
  ...HomeScreenStyles,
  ...NavigationRootStyles,
  ...SetPasscodeScreenStyles,
};

export type RootStyles = typeof styles;
