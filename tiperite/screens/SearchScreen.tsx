import { StackNavigatorScreenProps } from '../types';
import { FlatList, View } from 'react-native';
import { TrTextInput } from '../components/TrTextInput';
import { TrButton } from '../components/TrButton';
import { useTheme } from '../hooks/useTheme';
import React from 'react';
import Fuse from 'fuse.js';

/**
 *
 */
export function SearchScreen({
  navigation,
}: StackNavigatorScreenProps<'SearchScreen'>): JSX.Element {
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [wholeWord, setWholeWord] = React.useState(false);
  const [extended, setExtended] = React.useState(false);
  const [matches, setMatches] = React.useState([]);
  const [fuzzy, setFuzzy] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const theme = useTheme('SearchScreen');

  function onSearch(): void {
    const fuse = new Fuse([], {
      minMatchCharLength: 1,
      useExtendedSearch: extended,
      isCaseSensitive: caseSensitive,
      ignoreFieldNorm: false,
      ignoreLocation: false,
      includeMatches: true,
      findAllMatches: true,
      includeScore: false,
      shouldSort: true,
      threshold: 0.6,
      distance: 100,
      location: 0,
    });
    fuse.search('');
  }

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
      renderItem={({ item }) => <View />}
      style={theme.root}
      data={matches}
    />
  );
}
