import { StackNavigatorParams } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import * as React from 'react';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';

const options: StackNavigationOptions = {
  headerShown: false,
};
const { Navigator, Screen } = createStackNavigator<StackNavigatorParams>();

export const StackNavigator = (): JSX.Element => (
  <Navigator screenOptions={options}>
    <Screen component={HomeScreen} name="Home" />
  </Navigator>
);
