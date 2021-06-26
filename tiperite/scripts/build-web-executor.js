const path = require('path');
const fs = require('fs').promises;

/**
 * Loading local files in WebView gets to be really miserable dealing with
 *  native assets, especially across multiple platforms. This build script
 *  allows us to dynamically generate TypeScript to load all our assets in JS.
 */
(async () => {
  try {
    // Import the UMD build of isomorphic-git
    const isogitJS = await fs.readFile(
      path.resolve(
        __dirname,
        '../node_modules/isomorphic-git/index.umd.min.js',
      ),
      'utf8',
    );

    // Get the HTML template we'll inject into WebExecutorHost
    const html = await fs.readFile(
      path.resolve(__dirname, '../WebExecutor.html'),
      'utf8',
    );

    // Build a .ts file that'll export the HTML to inject into WebExecutor
    await fs.writeFile(
      path.resolve(__dirname, '../constants/WebExecutorHTML.ts'),
      [
        'export const WebExecutorHTML = `',
        html
          .replace('%ISOGIT%', Buffer.from(isogitJS).toString('base64'))
          .trim(),
        '`;',
      ].join('\n'),
    );
  } catch (err) {
    console.error(err);
  }
})();
