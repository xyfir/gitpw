import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export const DocListItemStyles: {
  DocListItem: {
    infoLine: StyleProp<TextStyle>;
    mainLine: StyleProp<ViewStyle>;
    title: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  DocListItem: {
    infoLine: {
      marginTop: 2,
    },
    mainLine: {
      flexDirection: 'row',
    },
    title: {
      marginBottom: 2,
      flex: 1,
    },
    root: {
      borderBottomColor: '#DDD',
      borderBottomWidth: 1,
      padding: 15,
    },
  },
};
