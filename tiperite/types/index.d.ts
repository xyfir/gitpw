import * as git from 'isomorphic-git';

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(msg: string): void;
    };
    KeyDeriverWeb: unknown;
    LightningFS: unknown;
    NativeProxy: unknown;
    AESWeb: unknown;
    git: typeof git;
    fs: unknown;
  }
}

export * from './common';
export * from './config';
export * from './filesystem';
export * from './lightning-fs';
export * from './navigation';
