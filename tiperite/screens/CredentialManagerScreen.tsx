import { TouchableOpacity, ScrollView, Alert, Text, View } from 'react-native';
import { CredentialID, StackNavigatorScreenProps } from '../types';
import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { TrTextInput } from '../components/TrTextInput';
import { useSelector } from '../hooks/useSelector';
import { useDispatch } from '../hooks/useDispatch';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import React from 'react';
import {
  selectNonNullableCredentials,
  credentialsSlice,
} from '../state/credentialsSlice';

/**
 * Allows the user to manage their git credentials
 */
export function CredentialManagerScreen({
  navigation,
}: StackNavigatorScreenProps<'CredentialManagerScreen'>): JSX.Element {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [selected, setSelected] = React.useState(-1);
  const [editing, setEditing] = React.useState(-1);
  const credentials = useSelector(selectNonNullableCredentials);
  const workspaces = useSelector(selectNonNullableWorkspaces);
  const dispatch = useDispatch();
  const theme = useTheme('CredentialManagerScreen');

  /**
   * Attempt to delete a credential
   */
  function onDelete(credentialId: CredentialID): void {
    // Check if the credential is currently linked to any workspaces
    for (const workspaceId of workspaces.allIds) {
      if (workspaces.byId[workspaceId].credentialId == credentialId) {
        Alert.alert(
          'You cannot delete a credential that is linked to a workspace',
        );
        return;
      }
    }

    // Update state
    setUsername('');
    setPassword('');
    setSelected(-1);
    setEditing(-1);
    dispatch(credentialsSlice.actions.delete(credentialId));
  }

  /**
   * Create a new credential or update an existing one
   */
  function onSave(): void {
    // Add new credential
    if (editing == -1) {
      dispatch(
        credentialsSlice.actions.add({
          username,
          password,
          type: 'Custom',
        }),
      );
    }
    // Update existing credential
    else {
      dispatch(
        credentialsSlice.actions.update({
          ...credentials.byId[credentials.allIds[editing]],
          username,
          password,
        }),
      );
    }
  }

  /**
   * Select the credential for editing
   */
  function onEdit(credentialId: CredentialID, index: number): void {
    setUsername(credentials.byId[credentialId].username);
    setPassword(credentials.byId[credentialId].password);
    setEditing(index);
  }

  return (
    <ScrollView style={theme.root}>
      {credentials.allIds.map((credentialId, index) =>
        editing == index ? null : (
          <TouchableOpacity
            onPress={() => setSelected(index)}
            key={credentialId}
          >
            <Text>{credentials.byId[credentialId].type}</Text>
            <Text>{credentials.byId[credentialId].username}</Text>
            <Text>{credentials.byId[credentialId].password}</Text>

            {selected == index ? (
              <View>
                <TrButton
                  onPress={() => onEdit(credentialId, index)}
                  title="Edit"
                />
                <TrButton
                  secondary
                  onPress={() => onDelete(credentialId)}
                  title="Delete"
                />
              </View>
            ) : null}
          </TouchableOpacity>
        ),
      )}

      <View>
        <TrTextInput
          returnKeyType="next"
          onChangeText={setUsername}
          placeholder="Username"
          label="Username"
          value={username}
        />

        <TrTextInput
          onSubmitEditing={onSave}
          textContentType="password"
          returnKeyType="done"
          onChangeText={setPassword}
          placeholder="Password"
          label="Password"
          value={password}
        />

        <TrButton onPress={onSave} title="Save" />
      </View>
    </ScrollView>
  );
}
