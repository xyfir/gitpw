import { CredentialManagerScreenStyles } from './screens/CredentialManagerScreenStyles';
import { WorkspacesListScreenStyles } from './screens/WorkspacesListScreenStyles';
import { EnterPasscodeScreenStyles } from './screens/EnterPasscodeScreenStyles';
import { AddWorkspaceScreenStyles } from './screens/AddWorkspaceScreenStyles';
import { TrTextInputPickerStyles } from './components/TrTextInputPickerStyles';
import { SetPasscodeScreenStyles } from './screens/SetPasscodeScreenStyles';
import { NavigationRootStyles } from './navigation/NavigationRootStyles';
import { SearchScreenStyles } from './screens/SearchScreenStyles';
import { EditorScreenStyles } from './screens/EditorScreenStyles';
import { TrTextInputStyles } from './components/TrTextInputStyles';
import { DocListItemStyles } from './screens/DocListItemStyles';
import { HomeScreenStyles } from './screens/HomeScreenStyles';
import { TrDividerStyles } from './components/TrDividerStyles';
import { TrButtonStyles } from './components/TrButtonStyles';
import { TrPickerStyles } from './components/TrPickerStyles';
import { TrModalStyles } from './components/TrModal';
import { TrTextStyles } from './components/TrTextStyles';

export const styles = {
  ...AddWorkspaceScreenStyles,
  ...CredentialManagerScreenStyles,
  ...DocListItemStyles,
  ...EditorScreenStyles,
  ...EnterPasscodeScreenStyles,
  ...HomeScreenStyles,
  ...SearchScreenStyles,
  ...NavigationRootStyles,
  ...SetPasscodeScreenStyles,
  ...TrButtonStyles,
  ...TrDividerStyles,
  ...TrModalStyles,
  ...TrPickerStyles,
  ...TrTextInputPickerStyles,
  ...TrTextInputStyles,
  ...TrTextStyles,
  ...WorkspacesListScreenStyles,
};

export type RootStyles = typeof styles;
