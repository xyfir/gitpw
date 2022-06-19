import { TextStyle, TextProps, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import React from 'react';

export interface TrTextProps extends TextProps {
  opacity?: TextStyle['opacity'];
  weight?: TextStyle['fontWeight'];
  size?: TextStyle['fontSize'];
}

/**
 * A common component for displaying text
 */
export function TrText({
  children,
  opacity,
  weight: fontWeight = '400',
  style,
  size: fontSize = 12,
  ...props
}: TrTextProps): JSX.Element {
  const theme = useTheme('TrText');

  return (
    <Text
      style={[theme.root, { fontWeight, fontSize, opacity }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}
