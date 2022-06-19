import { StyleProp, ViewStyle } from 'react-native';

export const TrModalStyles: {
  TrModal: {
    Pressable: StyleProp<ViewStyle>;
    BlurView: StyleProp<ViewStyle>;
  };
} = {
  TrModal: {
    Pressable: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    BlurView: {
      flex: 1,
    },
  },
};
