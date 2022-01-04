import { CredentialManagerScreen } from '../screens/CredentialManagerScreen';
import { WorkspacesListScreen } from '../screens/WorkspacesListScreen';
import { StackNavigatorParams } from '../types';
import { EnterPasscodeScreen } from '../screens/EnterPasscodeScreen';
import { AddWorkspaceScreen } from '../screens/AddWorkspaceScreen';
import { SetPasscodeScreen } from '../screens/SetPasscodeScreen';
import { EditorScreen } from '../screens/EditorScreen';
import { EntryScreen } from '../screens/EntryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import * as React from 'react';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';

const options: StackNavigationOptions = {
  animationEnabled: true,
  headerShown: true,
};
const noHeaderOptions: StackNavigationOptions = {
  headerShown: false,
};
const { Navigator, Screen } = createStackNavigator<StackNavigatorParams>();

export const StackNavigator = (): JSX.Element => (
  <Navigator initialRouteName="EntryScreen" screenOptions={options}>
    <Screen
      component={CredentialManagerScreen}
      options={{ headerTitle: 'Credentials' }}
      name="CredentialManagerScreen"
    />
    <Screen
      component={WorkspacesListScreen}
      options={{ headerTitle: 'Workspaces' }}
      name="WorkspacesListScreen"
    />
    <Screen
      component={EnterPasscodeScreen}
      options={noHeaderOptions}
      name="EnterPasscodeScreen"
    />
    <Screen
      component={AddWorkspaceScreen}
      options={{ headerTitle: 'Add workspace' }}
      name="AddWorkspaceScreen"
    />
    <Screen
      component={EditorScreen}
      options={{ headerTitle: 'Editor' }}
      name="EditorScreen"
    />
    <Screen
      component={SetPasscodeScreen}
      options={noHeaderOptions}
      name="SetPasscodeScreen"
    />
    <Screen
      component={EntryScreen}
      options={noHeaderOptions}
      name="EntryScreen"
    />
    <Screen
      component={HomeScreen}
      options={noHeaderOptions}
      name="HomeScreen"
    />
  </Navigator>
);
