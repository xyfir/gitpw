import { Dimensions, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import React from 'react';

const html = /* html */ `
<!DOCTYPE html>
<html>
<head>
  <title>tiperite</title>

  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />

  <style>
    #root,
    body,
    html {
      -webkit-overflow-scrolling: touch;
      min-height: 100%;
      padding: 0;
      margin: 0;
      width: 100%;
    }
    #root {
      flex-shrink: 0;
      flex-basis: auto;
      flex-grow: 1;
      display: flex;
      flex: 1;
    }
    html {
      -webkit-text-size-adjust: 100%;
      scroll-behavior: smooth;
      height: calc(100% + env(safe-area-inset-top));
    }
    body {
      -moz-osx-font-smoothing: grayscale;
      -webkit-font-smoothing: antialiased;
      overscroll-behavior-y: none;
      -ms-overflow-style: scrollbar;
      text-rendering: optimizeLegibility;
      overflow-y: auto;
      display: flex;
    }
  </style>
</head>

<body>
  <div id="root"></div>
</body>
</html>
`;

// inject js from tiperite/web-build/app.js

export default function App(): JSX.Element | null {
  return (
    <WebView
      mixedContentMode="always"
      // originWhitelist and baseUrl are required for IndexedDB to work
      originWhitelist={['*']}
      containerStyle={styles.root}
      source={{ baseUrl: 'https://github.com/', html }}
      style={styles.root}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
});
