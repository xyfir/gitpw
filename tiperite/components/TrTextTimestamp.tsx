import { formatDistanceToNowStrict } from 'date-fns';
import { TrTextProps, TrText } from './TrText';
import { DateString } from '../types';
import React from 'react';

interface TrTextTimestampProps extends Omit<TrTextProps, 'children'> {
  ts: DateString;
}

export function TrTextTimestamp({
  ts,
  ...props
}: TrTextTimestampProps): JSX.Element {
  const tsText = React.useMemo(() => {
    const date = new Date(ts);
    return `${formatDistanceToNowStrict(date, {
      addSuffix: true,
    })}, ${date.toLocaleString()}`;
  }, [ts]);
  return <TrText {...props}>{tsText}</TrText>;
}
