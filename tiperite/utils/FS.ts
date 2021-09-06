import { WebExecutor } from './WebExecutor';

/**
 * A wrapper for the web-based filesystem, LightningFS, based on Node's `fs`
 *
 * @see https://github.com/isomorphic-git/lightning-fs
 * @see https://nodejs.org/api/fs.html
 */
export class FS {
  /**
   * Write a file as a string
   */
  public static writeFile(path: string, data: string): Promise<void> {
    return WebExecutor.exec<void>(
      /* js */ `
        return await window.fs.promises.writeFile(params.path, params.data);
      `,
      {
        path,
        data,
      },
    ).promise;
  }

  /**
   * Read a file as a string or return `null` if the file doesn't exist
   */
  public static readFile<T extends string>(path: string): Promise<T | null> {
    return WebExecutor.exec<T | null>(
      /* js */ `
        return await window.fs.promises.readFile(params.path, 'utf8')
          .catch((e) => {
            if (e.code == 'ENOENT') return null;
            throw e;
          });
      `,
      {
        path,
      },
    ).promise;
  }

  /**
   * Delete a file
   */
  public static unlink(path: string): Promise<void> {
    return WebExecutor.exec<void>(
      /* js */ `
        return await window.fs.promises.unlink(params.path);
      `,
      {
        path,
      },
    ).promise;
  }
}
