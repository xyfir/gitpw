import { TrTextInputProps, TrTextInput } from './TrTextInput';
import { TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TrButton } from './TrButton';
import { TrModal } from './TrModal';
import { TrText } from './TrText';
import React from 'react';

interface Option {
  subtext?: string;
  title: string;
  value: string;
}

/**
 * A modal that allows the user to select an option
 */
export function TrPicker({
  onAddNew,
  options,
  onPick,
  inForm,
  style,
  value,
  label,
}: {
  onAddNew: () => void;
  options: Option[];
  inForm?: TrTextInputProps['inForm'];
  onPick: (value: Option['value']) => void;
  style?: TrTextInputProps['style'];
  value?: Option['value'];
  label: string;
}): JSX.Element {
  const [selecting, setSelecting] = React.useState(false);
  const selected = React.useMemo(
    () => options.find((o) => o.value == value),
    [value],
  );
  const theme = useTheme('TrPicker');

  function onAddNewFromModal(): void {
    onAddNew();
    setSelecting(false);
  }

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
    <>
      <TrTextInput
        endAdornment={
          <TrText weight="700" style={theme.dropdownIcon} size={20}>
            {'^'}
          </TrText>
        }
        onPress={options.length ? onOpenSelector : onAddNew}
        inForm={inForm}
        value={selected ? selected.title : ''}
        style={style}
        label={label}
      />

      <TrModal onClose={onClose} visible={selecting}>
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
    </>
  );
}
