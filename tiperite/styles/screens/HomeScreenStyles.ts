import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export const HomeScreenStyles: {
  HomeScreen: {
    infoLine: StyleProp<TextStyle>;
    docMain: StyleProp<ViewStyle>;
    footer: StyleProp<ViewStyle>;
    button: StyleProp<TextStyle>;
    title: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
    doc: StyleProp<ViewStyle>;
  };
} = {
  HomeScreen: {
    infoLine: {
      marginTop: 2,
    },
    docMain: {
      flexDirection: 'row',
    },
    footer: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    button: {
      marginTop: 20,
    },
    title: {
      marginBottom: 2,
      flex: 1,
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
