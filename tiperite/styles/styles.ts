import { CredentialManagerScreenStyles } from './screens/CredentialManagerScreenStyles';
import { EnterPasscodeScreenStyles } from './screens/EnterPasscodeScreenStyles';
import { AddWorkspaceScreenStyles } from './screens/AddWorkspaceScreenStyles';
import { SetPasscodeScreenStyles } from './screens/SetPasscodeScreenStyles';
import { NavigationRootStyles } from './navigation/NavigationRootStyles';
import { TrTextInputStyles } from './components/TrTextInputStyles';
import { HomeScreenStyles } from './screens/HomeScreenStyles';
import { TrButtonStyles } from './components/TrButtonStyles';

export const styles = {
  ...AddWorkspaceScreenStyles,
  ...CredentialManagerScreenStyles,
  ...EnterPasscodeScreenStyles,
  ...HomeScreenStyles,
  ...NavigationRootStyles,
  ...SetPasscodeScreenStyles,
  ...TrButtonStyles,
  ...TrTextInputStyles,
};

export type RootStyles = typeof styles;
