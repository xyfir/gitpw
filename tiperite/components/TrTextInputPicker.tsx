import { TrTextInputProps, TrTextInput } from './TrTextInput';
import { useTheme } from '../hooks/useTheme';
import { TrText } from './TrText';
import React from 'react';
import {
  TrPickerModalProps,
  TrPickerOption,
  TrPickerModal,
} from './TrPickerModal';

/**
 * A `TrTextInput` component that when pressed opens a picker modal
 */
export function TrTextInputPicker({
  onAddNew,
  options,
  onPick,
  inForm,
  style,
  value,
  label,
}: Pick<TrPickerModalProps, 'onAddNew' | 'options' | 'onPick' | 'value'> & {
  inForm?: TrTextInputProps['inForm'];
  style?: TrTextInputProps['style'];
  label: string;
}): JSX.Element {
  const [selecting, setSelecting] = React.useState(false);
  const selected = React.useMemo(
    () => options.find((o) => o.value == value),
    [value],
  );
  const theme = useTheme('TrTextInputPicker');

  function onOpenSelector(): void {
    setSelecting(true);
  }

  function onPickItem(value: TrPickerOption['value']): void {
    setSelecting(false);
    onPick(value);
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

      <TrPickerModal
        onAddNew={onAddNew}
        onClose={() => setSelecting(false)}
        options={options}
        onPick={onPickItem}
        value={value}
        open={selecting}
      />
    </>
  );
}
