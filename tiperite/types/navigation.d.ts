import type { StackScreenProps } from '@react-navigation/stack';

/**
 * The screens within `StackNavigator` and the params they expect to receive
 */
export type StackNavigatorParams = {
  CredentialManagerScreen: undefined;
  EnterPasscodeScreen: undefined;
  AddWorkspaceScreen: undefined;
  SetPasscodeScreen: undefined;
  EntryScreen: undefined;
  HomeScreen: undefined;
};

/**
 * A shortcut for getting the type of a `StackNavigator` screens component props
 *
 * @example function TestScreen(p: StackNavigatorScreenProps<'TestScreen'>) {}
 */
export type StackNavigatorScreenProps<K extends keyof StackNavigatorParams> =
  StackScreenProps<StackNavigatorParams, K>;
