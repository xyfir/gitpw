import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { SansSerif } from '../../constants/SansSerif';

export const TrTextInputStyles: {
  TrTextInput: {
    placeholderText_dark: Pick<TextStyle, 'color'>;
    placeholderText: Pick<TextStyle, 'color'>;
    inputWrap_dark: StyleProp<ViewStyle>;
    input_dark: StyleProp<TextStyle>;
    label_dark: StyleProp<TextStyle>;
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
    label_dark: {
      color: '#FFF',
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
      fontFamily: SansSerif.Regular,
      paddingTop: 10,
      textAlign: 'center',
      fontSize: 14,
      color: '#000',
      flex: 1,
    },
    label: {
      marginBottom: 7,
      fontFamily: SansSerif.Bold,
      fontSize: 14,
      color: '#000',
    },
    root: {
      paddingHorizontal: 10,
      width: '100%',
    },
  },
};
