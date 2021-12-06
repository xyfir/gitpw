import { TouchableOpacity, FlatList, View } from 'react-native';
import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { selectDocs, docsSlice } from '../state/docsSlice';
import { useTrSelector } from '../hooks/useTrSelector';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { TrText } from '../components/TrText';
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

  React.useEffect(() => {
    const workspace = workspaces.byId[workspaces.allIds[0]];

    // Get documents in workspace
    const dir = `/workspaces/${workspaces.allIds[0]}/docs`;
    FS.readdir(dir)
      .then((files) => {
        // Read each file
        return Promise.all(
          files.map((file) => {
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
            return TrAES.decrypt(doc.header, workspace.passkey).then(
              (header) => {
                const meta: DecryptedDocMeta = {
                  createdAt: doc.createdAt,
                  updatedAt: doc.updatedAt,
                  header: JSON.parse(header as JSONString),
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
        <TrButton
          onPress={onAddWorkspace}
          title="Add Workspace"
          style={theme.button}
        />
      }
      renderItem={({ item: docId }) => (
        <TouchableOpacity style={theme.doc}>
          <TrText weight="600" style={theme.title} size={16}>
            {docs.byId[docId].header.title || 'Untitled'}
          </TrText>
          <TrText opacity={0.5}>
            {docs.byId[docId].header.updated || docs.byId[docId].updatedAt}
          </TrText>
          <TrText opacity={0.5}>
            {docs.byId[docId].header.tags || docs.byId[docId].header.folder}
          </TrText>
        </TouchableOpacity>
      )}
      style={theme.root}
      data={docs.allIds}
    />
  ) : null;
}
