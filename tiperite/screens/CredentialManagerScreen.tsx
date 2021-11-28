import { TouchableOpacity, ScrollView, Alert, View } from 'react-native';
import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { useTrSelector } from '../hooks/useTrSelector';
import { useTrDispatch } from '../hooks/useTrDispatch';
import { CredentialID } from '../types';
import { TrTextInput } from '../components/TrTextInput';
import { TrDivider } from '../components/TrDivider';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { TrAlert } from '../utils/TrAlert';
import { TrText } from '../components/TrText';
import React from 'react';
import {
  selectNonNullableCredentials,
  credentialsSlice,
} from '../state/credentialsSlice';

/**
 * Allows the user to manage their git credentials
 */
export function CredentialManagerScreen(): JSX.Element {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [selected, setSelected] = React.useState(-1);
  const [editing, setEditing] = React.useState(-1);
  const credentials = useTrSelector(selectNonNullableCredentials);
  const workspaces = useTrSelector(selectNonNullableWorkspaces);
  const dispatch = useTrDispatch();
  const theme = useTheme('CredentialManagerScreen');

  /**
   * Attempt to delete a credential
   */
  async function onDelete(credentialId: CredentialID): Promise<void> {
    const y = await TrAlert.confirm(
      'Are you sure you want to delete this credential?',
    );
    if (!y) return;

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
    reset();
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

    reset();
  }

  /**
   * Select the credential for editing
   */
  function onEdit(credentialId: CredentialID, index: number): void {
    setUsername(credentials.byId[credentialId].username);
    setPassword(credentials.byId[credentialId].password);
    setEditing(index);
  }

  /**
   * Reset the local state
   */
  function reset(): void {
    setUsername('');
    setPassword('');
    setSelected(-1);
    setEditing(-1);
  }

  return (
    <ScrollView
      contentContainerStyle={theme.contentContainer}
      style={theme.root}
    >
      <TrTextInput
        returnKeyType="next"
        onChangeText={setUsername}
        placeholder="Username"
        inForm
        label="Username"
        value={username}
      />

      <TrTextInput
        onSubmitEditing={onSave}
        textContentType="password"
        returnKeyType="done"
        onChangeText={setPassword}
        placeholder="Password"
        inForm
        label="Password"
        value={password}
      />

      <TrButton onPress={onSave} title="Save" />

      {credentials.allIds.length ? <TrDivider /> : null}

      {credentials.allIds.map((credentialId, index) =>
        editing == index ? null : (
          <TouchableOpacity
            onPress={() => setSelected(index)}
            style={theme.credential}
            key={credentialId}
          >
            <View style={theme.credentialText}>
              <TrText weight="700">
                {credentials.byId[credentialId].type} Credential
              </TrText>
              <TrText numberOfLines={1}>
                {credentials.byId[credentialId].username}
              </TrText>
              <TrText numberOfLines={1} opacity={0.8}>
                {'*'.repeat(credentials.byId[credentialId].password.length)}
              </TrText>
            </View>

            {selected == index ? (
              <View style={theme.credentialButtons}>
                <TrButton
                  onPress={() => onEdit(credentialId, index)}
                  title="Edit"
                  small
                />
                <TrButton
                  secondary
                  onPress={() => onDelete(credentialId)}
                  title="Delete"
                  small
                />
              </View>
            ) : null}
          </TouchableOpacity>
        ),
      )}
    </ScrollView>
  );
}
