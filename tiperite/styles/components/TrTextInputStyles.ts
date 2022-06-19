import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SansSerifFont } from '../../constants/fonts';

export const TrTextInputStyles: {
  TrTextInput: {
    placeholderText_dark: Pick<TextStyle, 'color'>;
    placeholderText: Pick<TextStyle, 'color'>;
    inputWrap_dark: StyleProp<ViewStyle>;
    input_dark: StyleProp<TextStyle>;
    rootInForm: StyleProp<ViewStyle>;
    inputWrap: StyleProp<ViewStyle>;
    input: StyleProp<TextStyle>;
    label: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  TrTextInput: {
    placeholderText_dark: {
      color: 'rgba(255, 255, 255, 0.4)',
    },
    placeholderText: {
      color: 'rgba(0, 0, 0, 0.4)',
    },
    inputWrap_dark: {
      backgroundColor: '#222',
    },
    input_dark: {
      color: '#FFF',
    },
    rootInForm: {
      marginBottom: 20,
      maxWidth: 325,
    },
    inputWrap: {
      backgroundColor: '#EEE',
      flexDirection: 'row',
      borderRadius: 8,
      alignItems: 'center',
    },
    input: {
      // React Native's TextInput has default padding and needs to be overridden
      paddingBottom: 10,
      paddingRight: 10,
      paddingLeft: 10,
      fontFamily: SansSerifFont,
      paddingTop: 10,
      textAlign: 'center',
      fontSize: 14,
      color: '#000',
      flex: 1,
    },
    label: {
      marginBottom: 7,
      fontFamily: SansSerifFont,
    },
    root: {
      width: '100%',
    },
  },
};
