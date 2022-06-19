import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './StackNavigator';
import { useTheme } from '../hooks/useTheme';
import * as React from 'react';

export function NavigationRoot(): JSX.Element {
  const theme = useTheme('NavigationRoot');
  return (
    <NavigationContainer theme={theme.container}>
      <StackNavigator />
    </NavigationContainer>
  );
}
