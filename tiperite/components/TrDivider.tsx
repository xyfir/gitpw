import { useTheme } from '../hooks/useTheme';
import { View } from 'react-native';
import React from 'react';

/**
 * A common component for displaying a divider to separate sections
 */
export function TrDivider(): JSX.Element {
  const theme = useTheme('TrDivider');
  return <View style={theme.root} />;
}
