import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { ColorSchemeName } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import NotFoundScreen from '../screens/NotFoundScreen';
import * as React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator(): JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
    </Stack.Navigator>
  );
}

export function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}): JSX.Element {
  return (
    <NavigationContainer
      theme={colorScheme == 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
