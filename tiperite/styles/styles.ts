import { CredentialManagerScreenStyles } from './screens/CredentialManagerScreenStyles';
import { EnterPasscodeScreenStyles } from './screens/EnterPasscodeScreenStyles';
import { AddWorkspaceScreenStyles } from './screens/AddWorkspaceScreenStyles';
import { TrTextInputPickerStyles } from './components/TrTextInputPickerStyles';
import { SetPasscodeScreenStyles } from './screens/SetPasscodeScreenStyles';
import { NavigationRootStyles } from './navigation/NavigationRootStyles';
import { TrPickerModalStyles } from './components/TrPickerModalStyles';
import { EditorScreenStyles } from './screens/EditorScreenStyles';
import { TrTextInputStyles } from './components/TrTextInputStyles';
import { HomeScreenStyles } from './screens/HomeScreenStyles';
import { TrDividerStyles } from './components/TrDividerStyles';
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
  ...TrPickerModalStyles,
  ...TrTextInputPickerStyles,
  ...TrTextInputStyles,
  ...TrTextStyles,
};

export type RootStyles = typeof styles;
