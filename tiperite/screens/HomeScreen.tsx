import { TouchableOpacity, FlatList, View } from 'react-native';
import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { selectDocs, docsSlice } from '../state/docsSlice';
import { ensureAllDocsLoaded } from '../utils/ensureAllDocsLoaded';
import { TrButtonPicker } from '../components/TrButtonPicker';
import { useTrSelector } from '../hooks/useTrSelector';
import { DocListItem } from '../components/DocListItem';
import { StorageFile } from '../utils/StorageFile';
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
  EncryptedDocMeta,
  EncryptedDocBody,
  WorkspaceID,
  JSONString,
  DocHeaders,
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

  async function loadRecentDocs(): Promise<void> {
    const { recentDocs } = StorageFile.getData();

    Promise.all(
      recentDocs.map(({ workspaceId, docId }) => {
        return FS.readJSON<EncryptedDocMeta>(
          `/workspaces/${workspaceId}/docs/${docId}.meta.json`,
        ).then((doc) => {
          return { workspaceId, meta: doc as EncryptedDocMeta };
        });
      }),
    )
      .then((docs) => {
        // Build DecryptedDocMeta to load into state
        return Promise.all(
          docs.map(({ workspaceId, meta }) => {
            const workspace = workspaces.byId[workspaceId];

            return TrCrypto.decrypt(meta.headers, workspace.keys).then(
              (headers) => {
                return {
                  workspaceId,
                  headers: JSON.parse(headers as JSONString) as DocHeaders,
                  meta,
                };
              },
            );
          }),
        );
      })
      .then((docs) => {
        store.dispatch(docsSlice.actions.load(docs));
      })
      .catch(console.error);
  }

  function onDeleteDoc(docId: DocID): void {
    TrAlert.confirm('Delete doc?').then((yes) => {
      if (!docs || !yes) return;

      const doc = docs.byId[docId];
      Promise.all([FS.unlink(doc.metaPath), FS.unlink(doc.bodyPath)])
        .then(() => {
          store.dispatch(docsSlice.actions.delete(docId));
        })
        .catch((err) => {
          console.error(err);
          TrAlert.alert('Could not delete doc');
        });
    });
  }

  function onOpenDoc(docId: DocID): void {
    navigation.navigate('EditorScreen', { docId });
  }

  function onAddDoc(workspaceId: WorkspaceID): void {
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
      FS.writeJSON(doc.metaPath, meta),
      FS.writeJSON(doc.bodyPath, body),
    ])
      .then(() => {
        navigation.navigate('EditorScreen', { docId });
      })
      .catch((err) => {
        console.error(err);
        TrAlert.alert('Could not save new doc');
      });
  }

  async function onPush(): Promise<void> {
    for (const workspaceId of workspaces.allIds) {
      const workspace = workspaces.byId[workspaceId];
      const git = new TrGit(workspace.id);

      const branches = await git.listBranches();
      const hasRemoteChanges = branches.length
        ? await git.hasRemoteChanges()
        : false; // new repo
      if (hasRemoteChanges) {
        TrAlert.alert('There are remote changes. Pull first.');
        return;
      }

      const files = await git.getUnstagedChanges();
      if (!files.length) continue;

      await git.addAll(files.filter((f) => !f.remove).map((f) => f.filepath));
      await git.removeAll(files.filter((f) => f.remove).map((f) => f.filepath));
      await git.commit('Update');
      await git.push();
    }
  }

  function onPull(): void {
    for (const workspaceId of workspaces.allIds) {
      const git = new TrGit(workspaceId);
      git.fastForward();
    }
  }

  React.useEffect(() => {
    loadRecentDocs();
  }, []);

  return (
    <FlatList
      ListFooterComponent={
        <View style={theme.footer}>
          <TrButton
            onPress={() => navigation.navigate('WorkspacesListScreen')}
            style={theme.button}
            title="Workspaces"
          />

          <TrButtonPicker
            onAddNew={() => navigation.push('AddWorkspaceScreen')}
            options={workspaces.allIds.map((id) => ({
              title: workspaces.byId[id].name,
              value: id,
            }))}
            onPick={onAddDoc}
            style={theme.button}
            title="Add Doc"
          />

          <TrButton
            onPress={() => navigation.navigate('SearchScreen')}
            style={theme.button}
            title="Search"
          />

          <TrButton onPress={onPush} style={theme.button} title="Push" />

          <TrButton onPress={onPull} style={theme.button} title="Pull" />
        </View>
      }
      onEndReached={ensureAllDocsLoaded}
      renderItem={
        docs
          ? ({ item: docId }) => (
              <DocListItem
                workspace={workspaces.byId[docs.byId[docId].workspaceId]}
                onPress={() => onOpenDoc(docId)}
                action={
                  <TouchableOpacity onPress={() => onDeleteDoc(docId)}>
                    <TrText weight="900" size={16}>
                      [x]
                    </TrText>
                  </TouchableOpacity>
                }
                doc={docs.byId[docId]}
              />
            )
          : () => null
      }
      style={theme.root}
      data={docs ? docs.allIds : []}
    />
  );
}
