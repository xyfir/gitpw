import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export const HomeScreenStyles: {
  HomeScreen: {
    footer: StyleProp<ViewStyle>;
    button: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  HomeScreen: {
    footer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    button: {
      marginTop: 20,
    },
    root: {
      alignSelf: 'center',
      maxWidth: 375,
      width: '100%',
    },
  },
};
