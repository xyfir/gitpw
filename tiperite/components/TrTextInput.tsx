import { TextInputProps, TextInput, ViewProps, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TrText } from './TrText';
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
          style={[theme.input, inputStyle]}
          value={value}
        />

        {endAdornment}
      </View>
    </View>
  );
}
