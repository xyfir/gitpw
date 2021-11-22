import { StyleProp, ViewStyle } from 'react-native';

export const CredentialManagerScreenStyles: {
  CredentialManagerScreen: {
    credentialButtons: StyleProp<ViewStyle>;
    contentContainer: StyleProp<ViewStyle>;
    credentialText: StyleProp<ViewStyle>;
    TrTextInput: StyleProp<ViewStyle>;
    credential: StyleProp<ViewStyle>;
    root: StyleProp<ViewStyle>;
  };
} = {
  CredentialManagerScreen: {
    credentialButtons: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: 95,
    },
    contentContainer: {
      justifyContent: 'center',
      flexGrow: 1,
    },
    credentialText: {
      flex: 1,
    },
    TrTextInput: {
      marginBottom: 20,
    },
    credential: {
      marginHorizontal: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginVertical: 20,
      flexDirection: 'row',
      borderRadius: 8,
      alignItems: 'center',
      padding: 10,
    },
    root: {
      marginTop: 20,
    },
  },
};
