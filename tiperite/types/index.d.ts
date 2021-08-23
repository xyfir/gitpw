declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(msg: string): void;
    };
    KeyDeriverWeb: unknown;
    LightningFS: unknown;
    NativeProxy: unknown;
    AESWeb: unknown;
    fs: unknown;
  }
}

export * from './lightning-fs';
export * from './navigation';
