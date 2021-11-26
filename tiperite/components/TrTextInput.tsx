import { useTheme } from '../hooks/useTheme';
import { TrText } from './TrText';
import React from 'react';
import {
  PressableProps,
  TextInputProps,
  Pressable,
  TextInput,
  ViewProps,
  View,
} from 'react-native';

export interface TrTextInputProps extends Omit<TextInputProps, 'style'> {
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  inputStyle?: TextInputProps['style'];
  onPress?: PressableProps['onPress'];
  style?: ViewProps['style'];
  label?: string;
}

export function TrTextInput({
  startAdornment,
  endAdornment,
  inputStyle,
  onPress,
  style,
  value,
  label,
  ...inputProps
}: TrTextInputProps): JSX.Element {
  const theme = useTheme('TrTextInput');

  return (
    <Pressable onPress={onPress} style={[theme.root, style]}>
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
    </Pressable>
  );
}
