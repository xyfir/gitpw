import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './StackNavigator';
import { useTheme } from '../hooks/useTheme';
import * as React from 'react';

export function Navigation(): JSX.Element {
  const theme = useTheme('NavigationContainer');
  return (
    <NavigationContainer theme={theme.root}>
      <StackNavigator />
    </NavigationContainer>
  );
}
