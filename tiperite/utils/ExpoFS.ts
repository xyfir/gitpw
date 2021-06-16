import * as FileSystem from 'expo-file-system';

/**
 * Implements the required subset of Node's `fs` interface for `isomorphic-git`
 *
 * ---
 *
 * **High-level documentation:**
 * @see https://github.com/isomorphic-git/isomorphic-git/blob/main/docs/fs.md
 * @see https://docs.expo.io/versions/latest/sdk/filesystem/
 *
 * **Low-level implemtnation examples:**
 * @see https://github.com/isomorphic-git/isomorphic-git/blob/89c0da78d5ebf3c9f2754b3c8d557155dd70c8d7/src/models/FileSystem.js
 * @see https://github.com/isomorphic-git/lightning-fs/blob/main/src/DefaultBackend.js
 */
export const ExpoFS = {
  promises: {
    readFile(
      filepath: string,
      { encoding }: { encoding?: 'utf8' } = {},
    ): Promise<Buffer | string> {
      // Return utf8 string
      if (encoding == 'utf8') {
        return FileSystem.readAsStringAsync(filepath);
      }
      // Return a Buffer
      else {
        return FileSystem.readAsStringAsync(filepath, {
          encoding: 'base64',
        }).then((base64) => {
          return Buffer.from(base64, 'base64');
        });
      }
    },

    // writeFile(file, data[, options])
    // unlink(path)
    // readdir(path[, options])
    // mkdir(path[, mode])
    // rmdir(path)
    // stat(path[, options])
    // lstat(path[, options])
  },
};
