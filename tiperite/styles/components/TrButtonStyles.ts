import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SansSerifFont } from '../../constants/fonts';

export const TrButtonStyles: {
  TrButton: {
    title_dark: StyleProp<TextStyle>;
    root_dark: StyleProp<ViewStyle>;
    title: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  TrButton: {
    title_dark: {
      color: '#000',
    },
    root_dark: {
      backgroundColor: '#FFF',
    },
    title: {
      fontFamily: SansSerifFont,
      fontWeight: '700',
      textAlign: 'center',
      fontSize: 14,
      color: '#FFF',
    },
    root: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#000',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: 5,
      alignItems: 'center',
      alignSelf: 'center',
    },
  },
};
