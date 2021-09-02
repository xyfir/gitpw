import { WebExecutor } from './WebExecutor';

/**
 * A wrapper for the web-based filesystem
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
        return await window.fs.readFile(params.path, 'utf8').catch((e) => {
          if (e.code == 'ENOENT') return null;
          throw e;
        });
      `,
      {
        path,
      },
    ).promise;
  }
}
