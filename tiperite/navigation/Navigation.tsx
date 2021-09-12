import { StackNavigator } from './StackNavigator';
import { useIsDark } from '../hooks/useIsDark';
import * as React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

export function Navigation(): JSX.Element {
  const dark = useIsDark();
  return (
    <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
      <StackNavigator />
    </NavigationContainer>
  );
}
