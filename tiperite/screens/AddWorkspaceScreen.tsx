import { LatestWorkspaceManifestVersion } from '../constants/versions';
import { selectNonNullableCredentials } from '../state/credentialsSlice';
import { TrTextInputPicker } from '../components/TrTextInputPicker';
import { workspacesSlice } from '../state/workspacesSlice';
import { useTrDispatch } from '../hooks/useTrDispatch';
import { useTrSelector } from '../hooks/useTrSelector';
import { TrTextInput } from '../components/TrTextInput';
import { TrButton } from '../components/TrButton';
import { TrPBKDF2 } from '../utils/TrPBKDF2';
import { TrCrypto } from '../utils/TrCrypto';
import { useTheme } from '../hooks/useTheme';
import { TrAlert } from '../utils/TrAlert';
import { Random } from '../utils/Random';
import { TrGit } from '../utils/TrGit';
import { View } from 'react-native';
import { FS } from '../utils/FS';
import React from 'react';
import {
  StackNavigatorScreenProps,
  WorkspaceManifestFileData,
  EncryptionKey,
} from '../types';

/**
 * Allow the user to add a new workspace from a remote git repository. If the
 *  repo exists but doesn't contain a Tiperite workspace, one will be
 *  initialized in the local clone of the repo.
 */
export function AddWorkspaceScreen({
  navigation,
}: StackNavigatorScreenProps<'AddWorkspaceScreen'>): JSX.Element {
  const credentials = useTrSelector(selectNonNullableCredentials);

  const [credentialId, setCredentialId] = React.useState(credentials.allIds[0]);
  const [passwords, setPasswords] = React.useState(['']);
  const [repoUrl, setRepoUrl] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [name, setName] = React.useState('');
  const dispatch = useTrDispatch();
  const theme = useTheme('AddWorkspaceScreen');

  /**
   * Attempt to add new workspace to the local filesystem and state
   */
  async function onSubmit(): Promise<void> {
    const id = Random.uuid();
    const dir = `/workspaces/${id}`;
    setBusy(true);

    try {
      if (!repoUrl || !name) throw 'Name and repo URL are required';

      const credential = credentials.byId[credentialId];
      if (!credential) throw 'No credential selected';

      // Validate that we can access the repo before clone
      const git = new TrGit({ credentialId, repoUrl, id });
      await git.getRemoteInfo();
      await git.clone();

      // Load workspace manifest
      const manifestPath = `${dir}/manifest.json`;
      const _manifest = await FS.readJSON<WorkspaceManifestFileData>(
        manifestPath,
      );
      let manifest: WorkspaceManifestFileData;
      if (!_manifest) {
        // Ask the user if they'd like to initialize a new workspace
        const initialize = await TrAlert.confirm(
          "This repo doesn't contain a Tiperite workspace. Would you like to initialize one?",
        );
        if (!initialize) throw Error("Repo doesn't contain a workspace");

        // Generate config to use for PBKDF2
        const iterations = TrPBKDF2.generateIterations();
        const salt = TrPBKDF2.generateSalt();

        // Generate key
        const passkey = await TrPBKDF2.deriveKey(
          passwords[0],
          salt,
          iterations,
        );
        const keys: EncryptionKey[] = [
          {
            passkey,
            type: 'AES-256-GCM',
          },
        ];

        // Encrypt key with itself
        const passkeyEncrypted = await TrCrypto.encrypt(passkey, keys);

        // Initialize workspace manifest
        manifest = {
          encryption: [
            {
              createdAt: new Date().toISOString(),
              keys: [
                {
                  passkey: passkeyEncrypted,
                  type: 'AES-256-GCM',
                },
              ],
            },
          ],
          password: {
            iterations,
            salt,
          },
          version: LatestWorkspaceManifestVersion,
        };
        await FS.writeJSON<WorkspaceManifestFileData>(manifestPath, manifest);
        await FS.mkdir(`${dir}/docs`);
      } else {
        manifest = _manifest;
      }

      // Parse and validate manifest
      if (manifest.version != LatestWorkspaceManifestVersion) {
        throw `Workspace manifest version ${manifest.version} is not supported`;
      }

      // Generate keys from password and manifest data
      const passkeys = await Promise.all(
        passwords.map((password) =>
          TrPBKDF2.deriveKey(
            password,
            manifest.password.salt,
            manifest.password.iterations,
          ),
        ),
      );
      const keys: EncryptionKey[] = passkeys.map((passkey) => ({
        passkey,
        type: 'AES-256-GCM',
      }));

      // Validate the password
      await TrCrypto.decrypt(
        manifest.encryption[0].keys[0].passkey,
        keys,
      ).catch(() => {
        throw 'Invalid workspace password(s) with valid git credentials';
      });

      // Add the workspace
      dispatch(
        workspacesSlice.actions.add({
          lastViewedAt: new Date().toISOString(),
          credentialId,
          repoUrl,
          config: {},
          keys,
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
        onChangeText={(p) => setPasswords([p])}
        placeholder="Password"
        inForm
        label="Workspace Pass"
        value={passwords[0]}
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

      <TrTextInputPicker
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
