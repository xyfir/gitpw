import { StyleProp, ViewStyle } from 'react-native';

export const CredentialManagerScreenStyles: {
  CredentialManagerScreen: {
    credentialButtons: StyleProp<ViewStyle>;
    contentContainer: StyleProp<ViewStyle>;
    credential_dark: StyleProp<ViewStyle>;
    credentialText: StyleProp<ViewStyle>;
    TrTextInput: StyleProp<ViewStyle>;
    credential: StyleProp<ViewStyle>;
    form: StyleProp<ViewStyle>;
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
    credential_dark: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    credentialText: {
      marginRight: 10,
      flex: 1,
    },
    TrTextInput: {
      marginBottom: 20,
    },
    credential: {
      marginHorizontal: 30,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      marginVertical: 10,
      flexDirection: 'row',
      borderRadius: 8,
      alignItems: 'center',
      padding: 10,
    },
    form: {
      marginHorizontal: 30,
    },
    root: {
      marginTop: 10,
    },
  },
};
