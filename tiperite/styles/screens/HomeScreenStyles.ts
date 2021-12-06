import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export const HomeScreenStyles: {
  HomeScreen: {
    button: StyleProp<TextStyle>;
    title: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
    doc: StyleProp<ViewStyle>;
  };
} = {
  HomeScreen: {
    button: {
      marginTop: 20,
    },
    title: {
      marginBottom: 4,
    },
    root: {
      alignSelf: 'center',
      maxWidth: 375,
      width: '100%',
    },
    doc: {
      borderBottomColor: '#DDD',
      borderBottomWidth: 1,
      padding: 15,
    },
  },
};
