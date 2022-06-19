import { StyleProp, TextStyle } from 'react-native';

export const TrTextInputPickerStyles: {
  TrTextInputPicker: {
    dropdownIcon: StyleProp<TextStyle>;
  };
} = {
  TrTextInputPicker: {
    dropdownIcon: {
      marginHorizontal: 10,
      fontFamily: 'monospace',
      transform: [{ rotate: '180deg' }],
    },
  },
};
