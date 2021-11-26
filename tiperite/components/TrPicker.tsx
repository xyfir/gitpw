import { useTheme } from '../hooks/useTheme';
import { TrText } from './TrText';
import React from 'react';
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  FlatList,
  Modal,
  View,
} from 'react-native';

interface Option {
  subtext?: string;
  title: string;
  value: string;
}

/**
 * A modal that allows the user to select an option
 */
export function TrPicker({
  options,
  onPick,
  style,
  value,
  label,
}: {
  options: Option[];
  onPick(value: Option['value']): void;
  style?: StyleProp<ViewStyle>;
  value: Option['value'];
  label: string;
}): JSX.Element {
  const [selecting, setSelecting] = React.useState(false);
  const selected = React.useMemo(
    () => options.find((o) => o.value == value) as Option,
    [value],
  );
  const theme = useTheme('TrPicker');

  function onOpenSelector(): void {
    setSelecting(true);
  }

  function onPressItem(item: Option): void {
    setSelecting(false);
    onPick(item.value);
  }

  function onClose(): void {
    setSelecting(false);
  }

  return (
    <View style={[theme.root, style]}>
      <TrText weight="700" style={theme.label} size={14}>
        {label}
      </TrText>

      <TouchableOpacity onPress={onOpenSelector}>
        <TrText>{selected.title}</TrText>
      </TouchableOpacity>

      <Modal
        onRequestClose={onClose}
        animationType="fade"
        transparent
        onDismiss={onClose}
        visible={selecting}
      >
        <FlatList
          keyExtractor={(option) => option.value}
          renderItem={({ item: option }) => (
            <TouchableOpacity onPress={() => onPressItem(option)}>
              <TrText weight="700">{option.title}</TrText>
              {option.subtext ? <TrText>{option.subtext}</TrText> : null}
            </TouchableOpacity>
          )}
          data={options}
        />
      </Modal>
    </View>
  );
}
