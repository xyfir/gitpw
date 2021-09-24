import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export const HomeScreenStyles: {
  HomeScreen: {
    textInput: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  HomeScreen: {
    textInput: {
      backgroundColor: 'gray',
      width: 200,
    },
    root: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
  },
};
