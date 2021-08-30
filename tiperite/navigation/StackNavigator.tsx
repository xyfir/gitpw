import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import * as React from 'react';
import {
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';

const options: StackNavigationOptions = {
  headerShown: false,
};
const Stack = createStackNavigator<RootStackParamList>();

export function StackNavigator(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}
