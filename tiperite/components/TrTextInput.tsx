import { TextInputProps, TextInput, ViewProps, View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import React from 'react';

export interface TrTextInputProps extends Omit<TextInputProps, 'style'> {
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  inputStyle?: TextInputProps['style'];
  style?: ViewProps['style'];
  label?: string;
}

export function TrTextInput({
  startAdornment,
  endAdornment,
  inputStyle,
  style,
  value,
  label,
  ...inputProps
}: TrTextInputProps): JSX.Element {
  const theme = useTheme('TrTextInput');

  return (
    <View style={[theme.root, style]}>
      {label ? <Text style={theme.label}>{label}</Text> : null}

      <View style={theme.inputWrap}>
        {startAdornment}

        <TextInput
          {...inputProps}
          placeholderTextColor={theme.placeholderText.color}
          style={[theme.input, inputStyle]}
          value={value}
        />

        {endAdornment}
      </View>
    </View>
  );
}
