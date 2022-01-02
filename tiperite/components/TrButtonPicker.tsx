import { TrPickerOption, TrPickerProps, TrPicker } from './TrPicker';
import { TrButtonProps, TrButton } from './TrButton';
import React from 'react';

/**
 * A `TrButton` component that when pressed opens a picker modal
 */
export function TrButtonPicker({
  onAddNew,
  options,
  onPick,
  style,
  title,
}: Pick<TrPickerProps, 'onAddNew' | 'options' | 'onPick'> & {
  style?: TrButtonProps['style'];
  title: TrButtonProps['title'];
}): JSX.Element {
  const [selecting, setSelecting] = React.useState(false);

  function onOpenSelector(): void {
    setSelecting(true);
  }

  function onPickItem(value: TrPickerOption['value']): void {
    setSelecting(false);
    onPick(value);
  }

  return (
    <>
      <TrButton
        onPress={options.length ? onOpenSelector : onAddNew}
        style={style}
        title={title}
      />

      <TrPicker
        onAddNew={onAddNew}
        onClose={() => setSelecting(false)}
        options={options}
        onPick={onPickItem}
        open={selecting}
      />
    </>
  );
}
