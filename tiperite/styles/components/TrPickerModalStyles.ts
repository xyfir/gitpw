import { StyleProp, ViewStyle } from 'react-native';

export const TrPickerModalStyles: {
  TrPickerModal: {
    selectedOption_dark: StyleProp<ViewStyle>;
    selectedOption: StyleProp<ViewStyle>;
    listContent: StyleProp<ViewStyle>;
    option_dark: StyleProp<ViewStyle>;
    option: StyleProp<ViewStyle>;
  };
} = {
  TrPickerModal: {
    selectedOption_dark: {
      borderColor: '#FFF',
    },
    selectedOption: {
      borderColor: '#000',
      borderWidth: 2,
    },
    listContent: {
      justifyContent: 'center',
      flex: 1,
    },
    option_dark: {
      backgroundColor: '#777',
    },
    option: {
      backgroundColor: '#EEE',
      marginVertical: 10,
      borderRadius: 8,
      padding: 10,
      width: 280,
    },
  },
};
