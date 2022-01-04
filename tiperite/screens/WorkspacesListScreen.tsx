import { StackNavigatorScreenProps, WorkspaceID } from '../types';
import { TouchableOpacity, FlatList, View } from 'react-native';
import { useTrSelector } from '../hooks/useTrSelector';
import { docsSlice } from '../state/docsSlice';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { TrAlert } from '../utils/TrAlert';
import { TrText } from '../components/TrText';
import { store } from '../state/store';
import { FS } from '../utils/FS';
import React from 'react';
import {
  selectNonNullableWorkspaces,
  workspacesSlice,
} from '../state/workspacesSlice';

/**
 * List local workspaces for management
 */
export function WorkspacesListScreen({
  navigation,
}: StackNavigatorScreenProps<'HomeScreen'>): JSX.Element | null {
  const workspaces = useTrSelector(selectNonNullableWorkspaces);
  const theme = useTheme('WorkspacesListScreen');

  function onDelete(workspaceId: WorkspaceID): void {
    TrAlert.confirm('Delete workspace?').then((yes) => {
      if (!yes) return;

      const dir = `/workspaces/${workspaceId}`;

      // Get all the docs in the workspace
      FS.readdir(`${dir}/docs`)
        // Delete each doc
        .then((files) => {
          return Promise.all(
            files.map((file) => FS.unlink(`${dir}/docs/${file}`)),
          );
        })
        // Delete manifest file and empty docs directory
        .then(() => {
          return Promise.all([
            FS.unlink(`${dir}/manifest.json`),
            FS.rmdir(`${dir}/docs`),
          ]);
        })
        // Delete workspace directory
        .then(() => {
          return FS.rmdir(dir);
        })
        // Update state
        .then(() => {
          store.dispatch(docsSlice.actions.deleteWorkspace(workspaceId));
          store.dispatch(workspacesSlice.actions.delete(workspaceId));
        })
        .catch((err) => {
          console.error(err);
          TrAlert.alert('Could not delete workspace');
        });
    });
  }

  return (
    <FlatList
      ListFooterComponent={
        <View style={theme.footer}>
          <TrButton
            onPress={() => navigation.navigate('AddWorkspaceScreen')}
            style={theme.button}
            title="Add"
          />
        </View>
      }
      renderItem={({ item: workspaceId }) => (
        <View style={theme.doc}>
          <View style={theme.docMain}>
            <TrText weight="600" style={theme.title} size={16}>
              {workspaces.byId[workspaceId].name}
            </TrText>

            <TouchableOpacity onPress={() => onDelete(workspaceId)}>
              <TrText weight="900" size={16}>
                [x]
              </TrText>
            </TouchableOpacity>
          </View>
        </View>
      )}
      style={theme.root}
      data={workspaces.allIds}
    />
  );
}
