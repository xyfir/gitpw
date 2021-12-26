import { TouchableOpacity, FlatList, View } from 'react-native';
import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { selectDocs, docsSlice } from '../state/docsSlice';
import { TrTextTimestamp } from '../components/TrTextTimestamp';
import { useTrSelector } from '../hooks/useTrSelector';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { TrCrypto } from '../utils/TrCrypto';
import { TrAlert } from '../utils/TrAlert';
import { TrText } from '../components/TrText';
import { TrGit } from '../utils/TrGit';
import { store } from '../state/store';
import { FS } from '../utils/FS';
import React from 'react';
import {
  StackNavigatorScreenProps,
  DecryptedDocMeta,
  EncryptedDocMeta,
  EncryptedDocBody,
  JSONString,
  DocsState,
  DocID,
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

  const workspaceId = workspaces.allIds[0];

  function onAddWorkspace(): void {
    navigation.navigate('AddWorkspaceScreen');
  }

  function onOpenDoc(docId: DocID): void {
    navigation.navigate('EditorScreen', { workspaceId, docId });
  }

  function onAddDoc(): void {
    store.dispatch(docsSlice.actions.add(workspaceId));

    const docs = store.getState().docs as DocsState;
    const docId = docs.allIds[docs.allIds.length - 1];
    const doc = docs.byId[docId];

    const meta: EncryptedDocMeta = {
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      headers: '',
      id: docId,
    };
    const body: EncryptedDocBody = {
      updatedAt: doc.updatedAt,
      blocks: [],
    };

    Promise.all([
      FS.writeFile(doc.metaPath, JSON.stringify(meta, null, 2)),
      FS.writeFile(doc.bodyPath, JSON.stringify(body, null, 2)),
    ])
      .then(() => {
        navigation.navigate('EditorScreen', { workspaceId, docId });
      })
      .catch((err) => {
        console.error(err);
        TrAlert.alert('Could not save new doc');
      });
  }

  async function onPush(): Promise<void> {
    const workspace = workspaces.byId[workspaceId];
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
    const workspace = workspaces.byId[workspaceId];
    const git = new TrGit(workspace.id);
    git.fastForward();
  }

  React.useEffect(() => {
    if (!workspaces.allIds.length) return;
    const workspace = workspaces.byId[workspaceId];

    // Get documents in workspace
    const dir = `/workspaces/${workspaceId}/docs`;
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
            return TrCrypto.decrypt(doc.headers, workspace.keys).then(
              (headers) => {
                const meta: DecryptedDocMeta = {
                  createdAt: doc.createdAt,
                  updatedAt: doc.updatedAt,
                  bodyPath: `/workspaces/${workspaceId}/docs/${doc.id}.body.json`,
                  metaPath: `/workspaces/${workspaceId}/docs/${doc.id}.meta.json`,
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

  return (
    <FlatList
      ListFooterComponent={
        <View style={theme.footer}>
          <TrButton
            onPress={onAddWorkspace}
            title="Add Workspace"
            style={theme.button}
          />

          <TrButton onPress={onAddDoc} title="Add Doc" style={theme.button} />

          <TrButton onPress={onPush} style={theme.button} title="Push" />

          <TrButton onPress={onPull} style={theme.button} title="Pull" />
        </View>
      }
      renderItem={
        docs
          ? ({ item: docId }) => (
              <TouchableOpacity
                onPress={() => onOpenDoc(docId)}
                style={theme.doc}
              >
                <TrText weight="600" style={theme.title} size={16}>
                  {docs.byId[docId].headers.title || 'Untitled'}
                </TrText>

                <TrTextTimestamp
                  numberOfLines={1}
                  opacity={0.5}
                  ts={
                    docs.byId[docId].headers.updated ||
                    docs.byId[docId].updatedAt
                  }
                />

                <TrText numberOfLines={1} opacity={0.5}>
                  {docs.byId[docId].headers.tags ||
                    docs.byId[docId].headers.folder}
                </TrText>
              </TouchableOpacity>
            )
          : () => null
      }
      style={theme.root}
      data={docs ? docs.allIds : []}
    />
  );
}
