import { StyleProp, ViewStyle } from 'react-native';

export const TrDividerStyles: {
  TrDivider: {
    root_dark: StyleProp<ViewStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  TrDivider: {
    root_dark: {
      backgroundColor: '#FFF',
    },
    root: {
      marginHorizontal: 50,
      backgroundColor: '#000',
      marginVertical: 20,
      opacity: 0.5,
      height: 2,
    },
  },
};
