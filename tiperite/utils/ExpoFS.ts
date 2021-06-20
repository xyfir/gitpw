import * as FileSystem from 'expo-file-system';

function FileSystemError(name: string) {
  return class extends Error {
    code: string;

    constructor() {
      super(...arguments);
      this.code = name;
      if (this.message) {
        this.message = name + ': ' + this.message;
      } else {
        this.message = name;
      }
    }
  };
}

const ENOENT = FileSystemError('ENOENT');

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

    mkdir(path: string): Promise<void> {
      return FileSystem.makeDirectoryAsync(path, { intermediates: true });
    },

    rmdir(path: string): Promise<void> {
      return FileSystem.deleteAsync(path, { idempotent: true });
    },

    unlink(path: string): Promise<void> {
      return FileSystem.deleteAsync(path, { idempotent: true });
    },

    readdir(path: string): Promise<string[]> {
      return FileSystem.readDirectoryAsync(path);
    },

    writeFile(
      filepath: string,
      data: Buffer | Uint8Array | string,
      { encoding }: { encoding?: 'utf8' } = { encoding: 'utf8' },
    ): Promise<void> {
      // Save UTF8
      if (typeof data == 'string') {
        if (encoding != 'utf8') throw new Error('Invalid writeFile encoding');

        return FileSystem.writeAsStringAsync(filepath, data, {
          encoding: 'utf8',
        });
      }

      // Convert uint8array to buffer
      if (data instanceof Uint8Array) data = Buffer.from(data);

      // Write buffer as base64
      return FileSystem.writeAsStringAsync(filepath, data.toString('base64'), {
        encoding: 'base64',
      });
    },

    stat(filepath: string) {
      return FileSystem.getInfoAsync(filepath, { size: true, md5: true }).then(
        (info) => {
          if (!info.exists) throw ENOENT;
          return {
            isDirectory: () => info.isDirectory,
            mtimeMs: info.modificationTime || Date.now(),
            isFile: () => !info.isDirectory,
            type: info.isDirectory ? 'dir' : 'file',
            size: info.size,
            mode: 0o666,
            ino: info.md5,
          };
        },
      );
    },

    lstat(filepath: string) {
      return this.stat(filepath);
    },
  },
};
