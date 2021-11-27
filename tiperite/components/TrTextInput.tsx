import { useTheme } from '../hooks/useTheme';
import { TrText } from './TrText';
import React from 'react';
import {
  TouchableOpacityProps,
  TouchableOpacity,
  TextInputProps,
  TextInput,
  ViewProps,
  View,
} from 'react-native';

export interface TrTextInputProps extends Omit<TextInputProps, 'style'> {
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  inputStyle?: TextInputProps['style'];
  onPress?: TouchableOpacityProps['onPress'];
  inForm?: boolean;
  style?: ViewProps['style'];
  label?: string;
}

export function TrTextInput({
  startAdornment,
  endAdornment,
  inputStyle,
  onPress,
  inForm,
  style,
  value,
  label,
  ...inputProps
}: TrTextInputProps): JSX.Element {
  const theme = useTheme('TrTextInput');

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}
      style={[theme.root, inForm ? theme.rootInForm : undefined, style]}
    >
      {label ? (
        <TrText weight="700" style={theme.label} size={14}>
          {label}
        </TrText>
      ) : null}

      <View style={theme.inputWrap}>
        {startAdornment}

        <TextInput
          {...inputProps}
          placeholderTextColor={theme.placeholderText.color}
          editable={!onPress}
          style={[theme.input, inputStyle]}
          value={value}
        />

        {endAdornment}
      </View>
    </TouchableOpacity>
  );
}
