import { StyleProp, ViewStyle } from 'react-native';

export const SearchScreenStyles: {
  SearchScreen: {
    searchInput: StyleProp<ViewStyle>;
    toggles: StyleProp<ViewStyle>;
    header: StyleProp<ViewStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  SearchScreen: {
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
