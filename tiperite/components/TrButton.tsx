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
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  title?: string;
  busy?: boolean;
}

export function TrButton({
  startAdornment,
  endAdornment,
  disabled,
  style,
  title,
  busy,
  ...props
}: TrButtonProps): JSX.Element {
  const theme = useTheme('TrButton');

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 0.5 : 0.2}
      disabled={disabled || busy}
      style={[theme.root, { opacity: disabled ? 0.5 : 1 }, style]}
      key={disabled ? 0 : 1}
      {...props}
    >
      {busy ? (
        <ActivityIndicator size="small" />
      ) : (
        <>
          {startAdornment}

          <Text style={theme.title}>{title}</Text>

          {endAdornment}
        </>
      )}
    </TouchableOpacity>
  );
}
