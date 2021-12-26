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
  DocHeaders,
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
    let originalDecryptedBlocks: string[];
    let originalEncryptedBlocks: string[];
    let originalEncryptedHeaderBlock: string;
    const originalDecryptedHeaderBlock = [
      ...Object.entries(doc.headers),
      ...Object.entries(doc.headers.x),
    ]
      .filter(([k]) => k != 'x')
      .map(([k, v]) => `${k} ${Array.isArray(v) ? v.join(' ') : v}`)
      .join('\n');

    FS.readFile(metaPath)
      .then((data) => {
        if (!data) return;
        const meta = JSON.parse(data) as EncryptedDocMeta;
        originalEncryptedHeaderBlock = meta.headers;
        return FS.readFile(bodyPath);
      })
      .then((data) => {
        if (!data) throw Error('Missing file');
        const body = JSON.parse(data) as EncryptedDocBody;
        originalEncryptedBlocks = body.blocks;
        return Promise.all(
          body.blocks.map((block) => {
            return TrCrypto.decrypt(block, workspace.keys);
          }),
        );
      })
      .then((blocks) => {
        originalDecryptedBlocks = blocks;
        setContent(`${originalDecryptedHeaderBlock}\n\n${blocks.join('\n\n')}`);
      })
      .catch(console.error);

    // Save doc's changes
    return () => {
      // Split the text input's content into header and body blocks
      const decryptedBlocks = contentRef.current.split('\n\n');
      const decryptedHeaderBlock = decryptedBlocks.shift();
      if (!decryptedHeaderBlock) return;

      // Parse the header text block into an object
      const headers: DocHeaders = { x: {} };
      decryptedHeaderBlock.split('\n').forEach((headerLine) => {
        const parts = headerLine.trim().split(' ');
        let key = parts.shift();

        if (!key) return;
        key = key.toLowerCase();

        switch (key as keyof DocHeaders) {
          case 'updated':
            headers.updated = parts.join(' ');
            break;
          case 'created':
            headers.created = parts.join(' ');
            break;
          case 'config': {
            const configKey = parts.shift();
            if (configKey) {
              headers.config = {
                ...headers.config,
                [configKey.toLowerCase()]: parts.join(' '),
              };
            }
            break;
          }
          case 'title':
            headers.title = parts.join(' ');
            break;
          case 'folder':
            headers.folder = parts.join(' ');
            break;
          case 'slug':
            headers.slug = parts.join(' ');
            break;
          case 'tags':
            headers.tags = parts;
            break;
          default:
            if (key.startsWith('x-')) headers.x[key] = parts.join(' ');
            else throw Error(`Unknown header: ${key}`);
        }
      });

      const blocksChanged = decryptedBlocks.some(
        (block, i) => originalDecryptedBlocks[i] != block,
      );
      const headerChanged =
        originalDecryptedHeaderBlock != decryptedHeaderBlock;
      if (!blocksChanged && !headerChanged) return;

      const updatedAt = new Date().toISOString();
      store.dispatch(docsSlice.actions.update({ ...doc, updatedAt }));

      // Encrypt new/changed blocks
      Promise.all(
        decryptedBlocks.map((block, i) => {
          return originalDecryptedBlocks[i] == block
            ? originalEncryptedBlocks[i]
            : TrCrypto.encrypt(block, workspace.keys);
        }),
      )
        // Write body file
        .then((blocks) => {
          const body: EncryptedDocBody = { updatedAt, blocks };
          return FS.writeFile(bodyPath, JSON.stringify(body, null, 2));
        })
        // Encrypt header
        .then(() => {
          return headerChanged
            ? TrCrypto.encrypt(JSON.stringify(headers), workspace.keys)
            : originalEncryptedHeaderBlock;
        })
        // Write header file
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
