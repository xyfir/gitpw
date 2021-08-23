/* eslint-disable */

const path = require('path');
const fs = require('fs').promises;

/**
 * Loading local files in WebView gets to be really miserable dealing with
 *  native assets, especially across multiple platforms. This build script
 *  allows us to dynamically generate TypeScript to load all our assets in JS.
 */
(async () => {
  try {
    // Import the React Native HTTP proxy
    const nativeProxyJS = await fs.readFile(
      path.resolve(__dirname, 'nativeProxy.js'),
      'utf8',
    );

    // Get the HTML template we'll inject into WebExecutorHost
    const indexHTML = await fs.readFile(
      path.resolve(__dirname, 'index.html'),
      'utf8',
    );

    // Import the UMD build of lightning-fs
    const lightningJS = await fs.readFile(
      path.resolve(
        __dirname,
        '../node_modules/@isomorphic-git/lightning-fs/dist/lightning-fs.min.js',
      ),
      'utf8',
    );

    // Import the UMD build of isomorphic-git
    const isogitJS = await fs.readFile(
      path.resolve(
        __dirname,
        '../node_modules/isomorphic-git/index.umd.min.js',
      ),
      'utf8',
    );

    // Import the compiled TypeScript
    const distJS = await fs.readFile(
      path.resolve(__dirname, 'dist.js'),
      'utf8',
    );

    // Build a .ts file that'll export the HTML to inject into WebExecutor
    await fs.writeFile(
      path.resolve(__dirname, '../constants/WebExecutorHTML.ts'),
      [
        '/* eslint-disable */',
        'export const WebExecutorHTML = `',
        indexHTML
          .replace(
            '%NATIVEPROXY%',
            Buffer.from(nativeProxyJS).toString('base64'),
          )
          .replace('%LIGHTNINGFS%', Buffer.from(lightningJS).toString('base64'))
          .replace('%ISOGIT%', Buffer.from(isogitJS).toString('base64'))
          .replace('%DIST%', Buffer.from(distJS).toString('base64'))
          .trim(),
        '`;',
      ].join('\n'),
    );

    console.log('=== Compile complete! ===');
  } catch (err) {
    console.error(err);
  }
})();
