import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export const SearchScreenStyles: {
  SearchScreen: {
    resultsCount: StyleProp<TextStyle>;
    searchInput: StyleProp<ViewStyle>;
    toggles: StyleProp<ViewStyle>;
    header: StyleProp<ViewStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  SearchScreen: {
    resultsCount: {
      marginTop: 10,
    },
    searchInput: {
      marginVertical: 10,
    },
    toggles: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    header: {},
    root: {
      alignSelf: 'center',
      maxWidth: 375,
      width: '100%',
    },
  },
};
