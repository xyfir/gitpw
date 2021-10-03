import { useTheme } from '../hooks/useTheme';
import { Haptics } from '../utils/Haptics';
import React from 'react';
import {
  TouchableOpacityProps,
  GestureResponderEvent,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';

export interface TrButtonProps
  extends Omit<TouchableOpacityProps, 'activeOpacity'> {
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  impactHaptic?: undefined | 'medium' | 'heavy' | 'light';
  title?: string;
  busy?: boolean;
}

export function TrButton({
  startAdornment,
  impactHaptic = 'light',
  endAdornment,
  disabled,
  onPress,
  style,
  title,
  busy,
  ...props
}: TrButtonProps): JSX.Element {
  const theme = useTheme('TrButton');

  /**
   * Capture press in order to provide haptic feedback
   */
  function onInternalPress(e: GestureResponderEvent): void {
    if (disabled || busy) return;
    if (impactHaptic) Haptics.impact(impactHaptic);
    if (onPress) onPress(e);
  }

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 0.5 : 0.2}
      disabled={disabled || busy}
      onPress={onInternalPress}
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
