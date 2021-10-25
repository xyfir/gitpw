import { Buffer } from 'buffer';

// @ts-ignore
global.Buffer = Buffer;

import { View } from 'react-native';
import React from 'react';

export default function App(): JSX.Element | null {
  return <View></View>;
}
