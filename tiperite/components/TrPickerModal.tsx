import { TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TrButton } from './TrButton';
import { TrModal } from './TrModal';
import { TrText } from './TrText';
import React from 'react';

export interface TrPickerOption {
  subtext?: string;
  title: string;
  value: string;
}

export interface TrPickerModalProps {
  onAddNew: () => void;
  onClose: () => void;
  options: TrPickerOption[];
  onPick: (option: TrPickerOption['value']) => void;
  value?: TrPickerOption['value'];
  open: boolean;
}

/**
 * A modal that allows the user to select an option
 */
export function TrPickerModal({
  onAddNew,
  onClose,
  options,
  onPick,
  value,
  open,
}: TrPickerModalProps): JSX.Element {
  const theme = useTheme('TrPickerModal');

  function onAddNewFromModal(): void {
    onAddNew();
    onClose();
  }

  function onPressItem(item: TrPickerOption): void {
    onClose();
    onPick(item.value);
  }

  return (
    <TrModal onClose={onClose} visible={open}>
      <FlatList
        contentContainerStyle={theme.listContent}
        ListFooterComponent={
          <TrButton onPress={onAddNewFromModal} title="Add new" />
        }
        keyExtractor={(option) => option.value}
        renderItem={({ item: option }) => (
          <TouchableOpacity
            onPress={() => onPressItem(option)}
            style={[
              theme.option,
              option.value == value ? theme.selectedOption : undefined,
            ]}
          >
            <TrText numberOfLines={1} weight="700" size={14}>
              {option.title}
            </TrText>
            {option.subtext ? (
              <TrText numberOfLines={1}>{option.subtext}</TrText>
            ) : null}
          </TouchableOpacity>
        )}
        data={options}
      />
    </TrModal>
  );
}
