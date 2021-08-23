declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(msg: string): void;
    };
    KeyDeriverWeb: unknown;
    NativeProxy: unknown;
    AESWeb: unknown;
  }
}

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};
