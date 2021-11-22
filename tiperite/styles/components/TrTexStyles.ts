import { StyleProp, TextStyle } from 'react-native';
import { SansSerifFont } from '../../constants/fonts';

export const TrTexStyles: {
  TrText: {
    root_dark: StyleProp<TextStyle>;
    root: StyleProp<TextStyle>;
  };
} = {
  TrText: {
    root_dark: {
      color: '#FFF',
    },
    root: {
      fontFamily: SansSerifFont,
      color: '#000',
    },
  },
};
