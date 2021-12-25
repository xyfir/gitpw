import { CredentialManagerScreenStyles } from './screens/CredentialManagerScreenStyles';
import { EnterPasscodeScreenStyles } from './screens/EnterPasscodeScreenStyles';
import { AddWorkspaceScreenStyles } from './screens/AddWorkspaceScreenStyles';
import { SetPasscodeScreenStyles } from './screens/SetPasscodeScreenStyles';
import { NavigationRootStyles } from './navigation/NavigationRootStyles';
import { EditorScreenStyles } from './screens/EditorScreenStyles';
import { TrTextInputStyles } from './components/TrTextInputStyles';
import { HomeScreenStyles } from './screens/HomeScreenStyles';
import { TrDividerStyles } from './components/TrDividerStyles';
import { TrPickerStyles } from './components/TrPickerStyles';
import { TrButtonStyles } from './components/TrButtonStyles';
import { TrModalStyles } from './components/TrModal';
import { TrTextStyles } from './components/TrTextStyles';

export const styles = {
  ...AddWorkspaceScreenStyles,
  ...CredentialManagerScreenStyles,
  ...EditorScreenStyles,
  ...EnterPasscodeScreenStyles,
  ...HomeScreenStyles,
  ...NavigationRootStyles,
  ...SetPasscodeScreenStyles,
  ...TrButtonStyles,
  ...TrDividerStyles,
  ...TrModalStyles,
  ...TrPickerStyles,
  ...TrTextStyles,
  ...TrTextInputStyles,
};

export type RootStyles = typeof styles;
