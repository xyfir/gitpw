import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SansSerifFont } from '../../constants/fonts';

export const HomeScreenStyles: {
  HomeScreen: {
    textInput: StyleProp<TextStyle>;
    text_dark: StyleProp<TextStyle>;
    text: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  HomeScreen: {
    textInput: {
      backgroundColor: 'gray',
      width: 200,
    },
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
