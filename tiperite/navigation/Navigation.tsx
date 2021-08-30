import { ColorSchemeName } from 'react-native';
import { StackNavigator } from './StackNavigator';
import * as React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

export const Navigation = ({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}): JSX.Element => (
  <NavigationContainer theme={colorScheme == 'dark' ? DarkTheme : DefaultTheme}>
    <StackNavigator />
  </NavigationContainer>
);
