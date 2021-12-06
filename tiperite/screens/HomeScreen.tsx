import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { useTrSelector } from '../hooks/useTrSelector';
import { docsSlice } from '../state/docsSlice';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { TrAES } from '../utils/TrAES';
import { store } from '../state/store';
import { View } from 'react-native';
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
}: StackNavigatorScreenProps<'HomeScreen'>): JSX.Element {
  const workspaces = useTrSelector(selectNonNullableWorkspaces);
  const theme = useTheme('HomeScreen');

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

  return (
    <View style={theme.root}>
      <TrButton onPress={onAddWorkspace} title="Add Workspace" />
    </View>
  );
}
