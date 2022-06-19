import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export const WorkspacesListScreenStyles: {
  WorkspacesListScreen: {
    workspace: StyleProp<ViewStyle>;
    button: StyleProp<TextStyle>;
    title: StyleProp<TextStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  WorkspacesListScreen: {
    workspace: {
      borderBottomColor: '#DDD',
      borderBottomWidth: 1,
      flexDirection: 'row',
      padding: 15,
    },
    button: {
      marginTop: 20,
    },
    title: {
      flex: 1,
    },
    root: {
      alignSelf: 'center',
      maxWidth: 375,
      width: '100%',
    },
  },
};
