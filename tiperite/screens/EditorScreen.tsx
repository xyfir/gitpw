import { selectNonNullableDocs, docsSlice } from '../state/docsSlice';
import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { View, TextInput } from 'react-native';
import { useTrSelector } from '../hooks/useTrSelector';
import { useTheme } from '../hooks/useTheme';
import { TrCrypto } from '../utils/TrCrypto';
import { TrAlert } from '../utils/TrAlert';
import { store } from '../state/store';
import { FS } from '../utils/FS';
import React from 'react';
import {
  StackNavigatorScreenProps,
  EncryptedDocBody,
  EncryptedDocMeta,
} from '../types';

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

  const contentRef = React.useRef(content);
  contentRef.current = content;

  // Load doc's content
  React.useEffect(() => {
    const metaPath = `/workspaces/${workspace.id}/docs/${doc.id}.meta.json`;
    const bodyPath = `/workspaces/${workspace.id}/docs/${doc.id}.body.json`;

    FS.readFile(bodyPath)
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

    // Save doc's changes
    return () => {
      const updatedAt = new Date().toISOString();
      store.dispatch(docsSlice.actions.update({ ...doc, updatedAt }));

      Promise.all(
        contentRef.current.split('\n\n').map((block) => {
          return TrCrypto.encrypt(block, workspace.keys);
        }),
      )
        .then((blocks) => {
          const body: EncryptedDocBody = { updatedAt, blocks };
          return FS.writeFile(bodyPath, JSON.stringify(body, null, 2));
        })
        .then(() => {
          return TrCrypto.encrypt(JSON.stringify(doc.headers), workspace.keys);
        })
        .then((headers) => {
          const encryptedMeta: EncryptedDocMeta = {
            createdAt: doc.createdAt,
            updatedAt,
            headers,
            id: doc.id,
          };
          return FS.writeFile(metaPath, JSON.stringify(encryptedMeta, null, 2));
        })
        .catch((err) => {
          console.error(err);
          TrAlert.alert('Could not save changes');
        });
    };
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
