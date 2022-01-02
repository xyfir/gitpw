import { StyleProp, TextStyle } from 'react-native';

export const TrPickerStyles: {
  TrPicker: {
    dropdownIcon: StyleProp<TextStyle>;
  };
} = {
  TrPicker: {
    dropdownIcon: {
      marginHorizontal: 10,
      fontFamily: 'monospace',
      transform: [{ rotate: '180deg' }],
    },
  },
};
