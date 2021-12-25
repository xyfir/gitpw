import { StackNavigatorScreenProps, EncryptedDocBody } from '../types';
import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { selectNonNullableDocs } from '../state/docsSlice';
import { View, TextInput } from 'react-native';
import { useTrSelector } from '../hooks/useTrSelector';
import { useTheme } from '../hooks/useTheme';
import { TrCrypto } from '../utils/TrCrypto';
import { FS } from '../utils/FS';
import React from 'react';

/**
 * An editor for a doc's content
 */
export function EditorScreen({
  route,
}: StackNavigatorScreenProps<'EditorScreen'>): JSX.Element | null {
  const [content, setContent] = React.useState('');
  const workspaces = useTrSelector(selectNonNullableWorkspaces);
  const workspace = workspaces.byId[route.params.workspaceId];
  const theme = useTheme('EditorScreen');
  const docs = useTrSelector(selectNonNullableDocs);
  const doc = docs.byId[route.params.docId];

  // Load doc's content
  React.useEffect(() => {
    FS.readFile(`/workspaces/${workspace.id}/docs/${doc.id}.body.json`)
      .then((data) => {
        if (!data) throw Error('Missing file');
        const body = JSON.parse(data) as EncryptedDocBody;
        return Promise.all(
          body.blocks.map((block) => {
            return TrCrypto.decrypt(block, workspace.keys);
          }),
        );
      })
      .then((blocks) => {
        setContent(blocks.join('\n\n'));
      })
      .catch(console.error);
  }, []);

  return (
    <View style={theme.root}>
      <TextInput
        onChangeText={setContent}
        multiline
        style={theme.textInput}
        value={content}
      />
    </View>
  );
}
