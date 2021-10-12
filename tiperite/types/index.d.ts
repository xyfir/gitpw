import * as git from 'isomorphic-git';

declare global {
  interface Window {
    ReactNativeWebView: {
      postMessage(msg: string): void;
    };
    NativeProxy: unknown;
    git: typeof git;
  }
}

export * from './common';
export * from './config';
export * from './filesystem';
export * from './lightning-fs';
export * from './navigation';
export * from './state';
