import { StackNavigatorScreenProps, WorkspaceManifestFileData } from '../types';
import { LatestWorkspaceManifestVersion } from '../constants/versions';
import { selectNonNullableCredentials } from '../state/credentialsSlice';
import { workspacesSlice } from '../state/workspacesSlice';
import { useTrDispatch } from '../hooks/useTrDispatch';
import { useTrSelector } from '../hooks/useTrSelector';
import { TrTextInput } from '../components/TrTextInput';
import { TrPicker } from '../components/TrPicker';
import { TrButton } from '../components/TrButton';
import { TrPBKDF2 } from '../utils/TrPBKDF2';
import { useTheme } from '../hooks/useTheme';
import { TrAlert } from '../utils/TrAlert';
import { Random } from '../utils/Random';
import { TrAES } from '../utils/TrAES';
import * as git from 'isomorphic-git';
import { View } from 'react-native';
import { FS } from '../utils/FS';
import React from 'react';
import http from 'isomorphic-git/http/web';

/**
 * Allow the user to add a new workspace
 */
export function AddWorkspaceScreen({
  navigation,
}: StackNavigatorScreenProps<'AddWorkspaceScreen'>): JSX.Element {
  const credentials = useTrSelector(selectNonNullableCredentials);

  const [credentialId, setCredentialId] = React.useState(credentials.allIds[0]);
  const [password, setPassword] = React.useState('');
  const [repoUrl, setRepoUrl] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [name, setName] = React.useState('');
  const dispatch = useTrDispatch();
  const theme = useTheme('AddWorkspaceScreen');

  async function onSubmit(): Promise<void> {
    const id = Random.uuid();
    const dir = `/workspaces/${id}`;
    setBusy(true);

    try {
      if (!repoUrl || !name) throw 'Name and repo are required';

      const credential = credentials.byId[credentialId];
      if (!credential) throw 'No credential selected';

      // Validate that we can access the repo
      await git.getRemoteInfo({
        corsProxy: 'https://cors.isomorphic-git.org',
        onAuth: () => ({
          username: credential.username,
          password: credential.password,
        }),
        http,
        url: repoUrl,
      });

      // Clone the repo
      await git.clone({
        corsProxy: 'https://cors.isomorphic-git.org',
        onAuth: () => ({
          username: credential.username,
          password: credential.password,
        }),
        http,
        url: repoUrl,
        dir,
        fs: FS.fs,
      });

      // Load workspace manifest
      const manifestString = await FS.readFile(`${dir}/manifest.json`);
      if (!manifestString) throw 'Repo is not a valid Tiperite workspace';
      const manifest = JSON.parse(manifestString) as WorkspaceManifestFileData;
      if (manifest.version != LatestWorkspaceManifestVersion) {
        throw `Workspace manifest version ${manifest.version} is not supported`;
      }

      // Generate key from password and manifest data
      const passkey = await TrPBKDF2.deriveKey(
        password,
        manifest.password.salt,
        manifest.password.iterations,
      );

      // Validate the password
      await TrAES.decrypt(manifest.password.ciphertext, passkey).catch(() => {
        throw 'Invalid workspace password (git credentials are valid)';
      });

      // Add the workspace
      dispatch(
        workspacesSlice.actions.add({
          lastViewedAt: new Date().toISOString(),
          credentialId,
          repoUrl,
          passkey,
          config: {},
          name,
          id,
        }),
      );

      navigation.goBack();
    } catch (err) {
      console.error(err);
      TrAlert.alert(`Error: ${String(err)}`);
      /** @todo file cleanup */
    }

    setBusy(false);
  }

  return (
    <View style={theme.root}>
      <TrTextInput
        returnKeyType="next"
        onChangeText={setName}
        placeholder="My Workspace"
        inForm
        label="Workspace Name"
        value={name}
      />

      <TrTextInput
        textContentType="password"
        onChangeText={setPassword}
        placeholder="Password"
        inForm
        label="Workspace Pass"
        value={password}
      />

      <TrTextInput
        textContentType="URL"
        returnKeyType="next"
        onChangeText={setRepoUrl}
        keyboardType="url"
        placeholder="https://github.com/example/workspace.git"
        inForm
        label="Git Repository"
        value={repoUrl}
      />

      <TrPicker
        onAddNew={() => navigation.push('CredentialManagerScreen')}
        options={credentials.allIds.map((id) => ({
          subtext: credentials.byId[id].type,
          title: credentials.byId[id].username,
          value: id,
        }))}
        onPick={setCredentialId}
        inForm
        value={credentialId}
        label="Git Credential"
      />

      <TrButton onPress={onSubmit} title="Add" busy={busy} />
    </View>
  );
}
