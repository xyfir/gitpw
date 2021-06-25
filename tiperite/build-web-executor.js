const path = require('path');
const fs = require('fs').promises;

(async () => {
  try {
    const isogitJS = await fs.readFile(
      path.resolve(__dirname, './node_modules/isomorphic-git/index.umd.min.js'),
      'utf8',
    );
    const html = await fs.readFile(
      path.resolve(__dirname, './constants/WebExecutor.html'),
      'utf8',
    );

    await fs.writeFile(
      path.resolve(__dirname, './constants/WebExecutorHTML.ts'),
      [
        "export const WebExecutorHTML = '",
        html
          .replace(
            '/* %ISOGIT% */',
            isogitJS.replace(/\\/g, '\\').replace(/'/g, "\\'"),
          )
          .replace(/\n/g, '\\'),
        "';",
      ].join(''),
    );
  } catch (err) {
    console.error(err);
  }
})();

// const path = require('path');
// const fs = require('fs').promises;

// (async () => {
//   try {
//     const isogitJS = await fs.readFile(
//       path.resolve(__dirname, './node_modules/isomorphic-git/index.umd.min.js'),
//       'utf8',
//     );
//     const html = await fs.readFile(
//       path.resolve(__dirname, './constants/WebExecutor.html'),
//       'utf8',
//     );

//     await fs.writeFile(
//       path.resolve(__dirname, './constants/WebExecutorHTML.ts'),
//       [
//         'export const WebExecutorHTML = `',
//         html.replace('/* %ISOGIT% */', isogitJS.replace(/`/g, '\\`')),
//         '`;',
//         '',
//       ].join('\n'),
//     );
//   } catch (err) {
//     console.error(err);
//   }
// })();
