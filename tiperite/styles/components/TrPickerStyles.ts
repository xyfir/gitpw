import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { SansSerifFont } from '../../constants/fonts';

export const TrPickerStyles: {
  TrPicker: {
    label: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  TrPicker: {
    label: {
      marginBottom: 7,
      fontFamily: SansSerifFont,
    },
    root: {},
  },
};
