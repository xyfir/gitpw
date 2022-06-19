import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SansSerifFont } from '../../constants/fonts';

export const EnterPasscodeScreenStyles: {
  EnterPasscodeScreen: {
    text_dark: StyleProp<TextStyle>;
    text: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  EnterPasscodeScreen: {
    text_dark: {
      color: '#FFF',
    },
    root: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    text: {
      fontFamily: SansSerifFont,
      color: '#000',
    },
  },
};
