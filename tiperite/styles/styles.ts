import { CredentialManagerScreenStyles } from './screens/CredentialManagerScreenStyles';
import { EnterPasscodeScreenStyles } from './screens/EnterPasscodeScreenStyles';
import { AddWorkspaceScreenStyles } from './screens/AddWorkspaceScreenStyles';
import { SetPasscodeScreenStyles } from './screens/SetPasscodeScreenStyles';
import { NavigationRootStyles } from './navigation/NavigationRootStyles';
import { TrTextInputStyles } from './components/TrTextInputStyles';
import { HomeScreenStyles } from './screens/HomeScreenStyles';
import { TrDividerStyles } from './components/TrDividerStyles';
import { TrButtonStyles } from './components/TrButtonStyles';
import { TrTextStyles } from './components/TrTextStyles';

export const styles = {
  ...AddWorkspaceScreenStyles,
  ...CredentialManagerScreenStyles,
  ...EnterPasscodeScreenStyles,
  ...HomeScreenStyles,
  ...NavigationRootStyles,
  ...SetPasscodeScreenStyles,
  ...TrButtonStyles,
  ...TrDividerStyles,
  ...TrTextStyles,
  ...TrTextInputStyles,
};

export type RootStyles = typeof styles;
