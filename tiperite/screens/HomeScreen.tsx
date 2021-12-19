import { TouchableOpacity, FlatList, View } from 'react-native';
import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { selectDocs, docsSlice } from '../state/docsSlice';
import { TrTextTimestamp } from '../components/TrTextTimestamp';
import { useTrSelector } from '../hooks/useTrSelector';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { TrAlert } from '../utils/TrAlert';
import { TrText } from '../components/TrText';
import { TrGit } from '../utils/TrGit';
import { TrAES } from '../utils/TrAES';
import { store } from '../state/store';
import { FS } from '../utils/FS';
import React from 'react';
import {
  StackNavigatorScreenProps,
  DecryptedDocMeta,
  JSONString,
} from '../types';

/**
 * This is the first screen the user sees after entering their passcode (or
 *  it's the first visible screen upon opening the app if they don't have a
 *  passcode).
 */
export function HomeScreen({
  navigation,
}: StackNavigatorScreenProps<'HomeScreen'>): JSX.Element | null {
  const workspaces = useTrSelector(selectNonNullableWorkspaces);
  const theme = useTheme('HomeScreen');
  const docs = useTrSelector(selectDocs);

  function onAddWorkspace(): void {
    navigation.navigate('AddWorkspaceScreen');
  }

  async function onPush(): Promise<void> {
    const workspace = workspaces.byId[workspaces.allIds[0]];
    const git = new TrGit(workspace.id);

    const hasRemoteChanges = await git.hasRemoteChanges();
    if (hasRemoteChanges) {
      TrAlert.alert('There are remote changes. Pull first.');
      return;
    }

    const files = await git.getUnstagedChanges();
    await git.addAll(files);
    await git.commit('Update');
    await git.push();
  }

  function onPull(): void {
    const workspace = workspaces.byId[workspaces.allIds[0]];
    const git = new TrGit(workspace.id);
    git.fastForward();
  }

  React.useEffect(() => {
    const workspace = workspaces.byId[workspaces.allIds[0]];

    // Get documents in workspace
    const dir = `/workspaces/${workspaces.allIds[0]}/docs`;
    FS.readdir(dir)
      .then((files) => {
        // Read each file
        return Promise.all(
          files
            .filter((file) => file.endsWith('.meta.json'))
            .map((file) => {
              return FS.readFile(`${dir}/${file}`).then((data) =>
                JSON.parse(data as JSONString),
              );
            }),
        );
      })
      .then((docs) => {
        // Build DecryptedDocMeta to load into state
        return Promise.all(
          docs.map((doc) => {
            return TrAES.decrypt(doc.headers, workspace.passkey).then(
              (headers) => {
                const meta: DecryptedDocMeta = {
                  createdAt: doc.createdAt,
                  updatedAt: doc.updatedAt,
                  headers: JSON.parse(headers as JSONString),
                  id: doc.id,
                };
                return meta;
              },
            );
          }),
        );
      })
      .then((docs) => {
        store.dispatch(docsSlice.actions.load(docs));
      })
      .catch(console.error);
  }, []);

  return docs ? (
    <FlatList
      ListFooterComponent={
        <View style={theme.footer}>
          <TrButton
            onPress={onAddWorkspace}
            title="Add Workspace"
            style={theme.button}
          />

          <TrButton onPress={onPush} style={theme.button} title="Push" />

          <TrButton onPress={onPull} style={theme.button} title="Pull" />
        </View>
      }
      renderItem={({ item: docId }) => (
        <TouchableOpacity style={theme.doc}>
          <TrText weight="600" style={theme.title} size={16}>
            {docs.byId[docId].headers.title || 'Untitled'}
          </TrText>

          <TrTextTimestamp
            numberOfLines={1}
            opacity={0.5}
            ts={docs.byId[docId].headers.updated || docs.byId[docId].updatedAt}
          />

          <TrText numberOfLines={1} opacity={0.5}>
            {docs.byId[docId].headers.tags || docs.byId[docId].headers.folder}
          </TrText>
        </TouchableOpacity>
      )}
      style={theme.root}
      data={docs.allIds}
    />
  ) : null;
}
