import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export const DocListItemStyles: {
  DocListItem: {
    highlight_dark: StyleProp<TextStyle>;
    preview_dark: StyleProp<ViewStyle>;
    previewLine: StyleProp<TextStyle>;
    highlight: StyleProp<TextStyle>;
    infoLine: StyleProp<TextStyle>;
    mainLine: StyleProp<ViewStyle>;
    preview: StyleProp<ViewStyle>;
    title: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  DocListItem: {
    highlight_dark: {
      backgroundColor: 'dodgerblue',
      fontFamily: 'monospace',
    },
    preview_dark: {
      borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    },
    previewLine: {
      fontFamily: 'monospace',
    },
    highlight: {
      backgroundColor: 'cyan',
      fontFamily: 'monospace',
    },
    infoLine: {
      marginTop: 2,
    },
    mainLine: {
      flexDirection: 'row',
    },
    preview: {
      borderLeftColor: 'rgba(0, 0, 0, 0.5)',
      borderLeftWidth: 3,
      paddingLeft: 10,
      marginLeft: 5,
      marginTop: 5,
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
