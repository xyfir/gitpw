import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { MonospaceFont } from '../../constants/fonts';

export const EditorScreenStyles: {
  EditorScreen: {
    textInput_dark: StyleProp<TextStyle>;
    textInput: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  EditorScreen: {
    textInput_dark: {
      color: '#FFF',
      flex: 1,
    },
    textInput: {
      fontFamily: MonospaceFont,
      fontSize: 15,
      padding: 20,
      color: '#000',
      flex: 1,
    },
    root: {
      flex: 1,
    },
  },
};
