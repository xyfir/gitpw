import { StorageFileWorkspace, DecryptedDocMeta } from '../types';
import { TouchableOpacity, View } from 'react-native';
import { TrTextTimestamp } from './TrTextTimestamp';
import { useTheme } from '../hooks/useTheme';
import { TrText } from './TrText';
import React from 'react';

/**
 * A Doc as displayed in a list
 */
export function DocListItem({
  workspace,
  onPress,
  preview,
  action,
  doc,
}: {
  workspace: StorageFileWorkspace;
  onPress(): void;
  preview?: string[];
  action: JSX.Element;
  doc: DecryptedDocMeta;
}): JSX.Element {
  const theme = useTheme('DocListItem');

  return (
    <TouchableOpacity onPress={onPress} style={theme.root}>
      <View style={theme.mainLine}>
        <TrText weight="600" style={theme.title} size={16}>
          {doc.headers.title || 'Untitled'}
        </TrText>

        {action}
      </View>

      <TrText numberOfLines={1} opacity={0.5} style={theme.infoLine}>
        {workspace.name}
      </TrText>

      <TrTextTimestamp
        numberOfLines={1}
        opacity={0.5}
        style={theme.infoLine}
        ts={doc.headers.updated || doc.updatedAt}
      />

      <TrText numberOfLines={1} opacity={0.5} style={theme.infoLine}>
        {doc.headers.tags || doc.headers.folder}
      </TrText>

      {preview ? (
        <View style={theme.preview}>
          {preview.map((line, i) => (
            <TrText
              numberOfLines={1}
              opacity={0.8}
              style={theme.previewLine}
              key={i}
            >
              {line}
            </TrText>
          ))}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
