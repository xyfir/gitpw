import { EnterPasscodeScreenStyles } from './screens/EnterPasscodeScreenStyles';
import { SetPasscodeScreenStyles } from './screens/SetPasscodeScreenStyles';
import { NavigationRootStyles } from './navigation/NavigationRootStyles';
import { HomeScreenStyles } from './screens/HomeScreenStyles';
import { TrButtonStyles } from './components/TrButtonStyles';

export const styles = {
  ...EnterPasscodeScreenStyles,
  ...HomeScreenStyles,
  ...NavigationRootStyles,
  ...SetPasscodeScreenStyles,
  ...TrButtonStyles,
};

export type RootStyles = typeof styles;
