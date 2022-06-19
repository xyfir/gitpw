import { useTheme } from '../hooks/useTheme';
import React from 'react';
import {
  TouchableOpacityProps,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';

export interface TrButtonProps
  extends Omit<TouchableOpacityProps, 'activeOpacity'> {
  secondary?: boolean;
  small?: boolean;
  title?: string;
  busy?: boolean;
}

export function TrButton({
  secondary,
  disabled,
  onPress,
  style,
  title,
  small,
  busy,
  ...props
}: TrButtonProps): JSX.Element {
  const theme = useTheme('TrButton');

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 0.5 : 0.2}
      disabled={disabled || busy}
      onPress={onPress}
      style={[
        theme.root,
        secondary ? theme.secondaryRoot : theme.primaryRoot,
        small ? theme.smallRoot : null,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
      key={disabled ? 0 : 1}
      {...props}
    >
      {busy ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text
          style={[
            theme.title,
            secondary ? theme.secondaryTitle : theme.primaryTitle,
            small ? theme.smallTitle : null,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
