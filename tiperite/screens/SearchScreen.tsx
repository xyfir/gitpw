import { TouchableOpacity, FlatList, View } from 'react-native';
import { StackNavigatorScreenProps, DocID } from '../types';
import { selectNonNullableWorkspaces } from '../state/workspacesSlice';
import { selectNonNullableDocs } from '../state/docsSlice';
import { loadDecryptedDocBody } from '../utils/loadDecryptedDocBody';
import { ensureAllDocsLoaded } from '../utils/ensureAllDocsLoaded';
import { useTrSelector } from '../hooks/useTrSelector';
import { DocListItem } from '../components/DocListItem';
import { TrTextInput } from '../components/TrTextInput';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import { TrText } from '../components/TrText';
import React from 'react';
import Fuse from 'fuse.js';

interface MatchingBlock {
  preview: string;
  index: number;
}

interface MatchingDoc {
  blocks: MatchingBlock[];
  docId: DocID;
}

/**
 * Search docs
 */
export function SearchScreen({
  navigation,
}: StackNavigatorScreenProps<'SearchScreen'>): JSX.Element {
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [wholeWord, setWholeWord] = React.useState(false);
  const [extended, setExtended] = React.useState(false);
  const [matches, setMatches] = React.useState<MatchingDoc[]>([]);
  const [fuzzy, setFuzzy] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const workspaces = useTrSelector(selectNonNullableWorkspaces);
  const theme = useTheme('SearchScreen');
  const docs = useTrSelector(selectNonNullableDocs);

  function onRemoveMatch(docId: DocID): void {
    setMatches(matches.filter((match) => match.docId != docId));
  }

  /**
   * Search docs
   */
  async function onSearch(): Promise<void> {
    const _matches: typeof matches = [];

    // Loop through docs
    for (const docId of docs.allIds) {
      const doc = docs.byId[docId];
      const workspace = workspaces.byId[doc.workspaceId];

      const blocks = await loadDecryptedDocBody(doc, workspace).then(
        (b) => b.decryptedBlocks,
      );

      // Search body blocks
      const fuse = new Fuse(blocks, {
        minMatchCharLength: 1,
        useExtendedSearch: extended,
        isCaseSensitive: caseSensitive,
        ignoreFieldNorm: false,
        ignoreLocation: true,
        includeMatches: true,
        findAllMatches: true,
        includeScore: false,
        shouldSort: true,
        threshold: 0.6,
        distance: 100,
        location: 0,
      });
      const results = fuse.search(query);
      if (!results.length) continue;

      _matches.push({
        blocks: results.map((r): MatchingBlock => {
          const startIndex = (r.matches as Fuse.FuseResultMatch[])[0]
            .indices?.[0][0];
          return {
            preview:
              startIndex > 40 ? `... ${r.item.substring(startIndex)}` : r.item,
            index: r.refIndex,
          };
        }),
        docId,
      });

      // search headers
    }

    console.log(_matches);
    setMatches(_matches);
  }

  // Load all docs if needed
  React.useEffect(() => {
    ensureAllDocsLoaded();
  }, []);

  return (
    <FlatList
      ListHeaderComponent={
        <View style={theme.header}>
          <TrTextInput
            onSubmitEditing={onSearch}
            autoCapitalize="none"
            returnKeyType="search"
            onChangeText={setQuery}
            placeholder="Search..."
            autoCorrect={false}
            autoFocus
            style={theme.searchInput}
            value={query}
          />
          {/*
            [fields = body, title, tags, folder]
           */}
          <View style={theme.toggles}>
            <TrButton
              onPress={() => setFuzzy(!fuzzy)}
              title={fuzzy ? 'fuzzy' : 'regex'}
              small
            />
            <TrButton
              onPress={() => setWholeWord(!wholeWord)}
              title={wholeWord ? 'word' : 'text'}
              small
            />
            <TrButton
              onPress={() => setCaseSensitive(!caseSensitive)}
              title={`case ${caseSensitive ? '' : 'in'}sensitive`}
              small
            />
            <TrButton
              onPress={() => setExtended(!extended)}
              title={extended ? 'extended' : 'simple'}
              small
            />
          </View>
        </View>
      }
      keyExtractor={(m) => m.docId}
      renderItem={({ item: match }) => (
        <DocListItem
          workspace={workspaces.byId[docs.byId[match.docId].workspaceId]}
          onPress={() => undefined}
          preview={match.blocks.map((b) => b.preview)}
          action={
            <TouchableOpacity onPress={() => onRemoveMatch(match.docId)}>
              <TrText weight="900" size={16}>
                [x]
              </TrText>
            </TouchableOpacity>
          }
          doc={docs.byId[match.docId]}
        />
      )}
      style={theme.root}
      data={matches}
    />
  );
}
