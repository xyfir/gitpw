import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SansSerifFont } from '../../constants/fonts';

export const TrButtonStyles: {
  TrButton: {
    secondaryTitle_dark: StyleProp<TextStyle>;
    secondaryRoot_dark: StyleProp<ViewStyle>;
    primaryTitle_dark: StyleProp<TextStyle>;
    primaryRoot_dark: StyleProp<ViewStyle>;
    secondaryTitle: StyleProp<TextStyle>;
    secondaryRoot: StyleProp<ViewStyle>;
    primaryTitle: StyleProp<TextStyle>;
    primaryRoot: StyleProp<ViewStyle>;
    smallTitle: StyleProp<TextStyle>;
    smallRoot: StyleProp<ViewStyle>;
    title: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  TrButton: {
    secondaryTitle_dark: {
      color: '#FFF',
    },
    secondaryRoot_dark: {
      backgroundColor: '#000',
      borderColor: '#FFF',
    },
    primaryTitle_dark: {
      color: '#000',
    },
    primaryRoot_dark: {
      backgroundColor: '#FFF',
    },
    secondaryTitle: {
      color: '#000',
    },
    secondaryRoot: {
      backgroundColor: '#FFF',
      borderColor: '#000',
      borderWidth: 1,
    },
    primaryTitle: {
      color: '#FFF',
    },
    primaryRoot: {
      backgroundColor: '#000',
    },
    smallTitle: {
      fontSize: 11,
    },
    smallRoot: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    title: {
      fontFamily: SansSerifFont,
      fontWeight: '700',
      textAlign: 'center',
      fontSize: 14,
    },
    root: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: 5,
      alignItems: 'center',
      alignSelf: 'center',
    },
  },
};
