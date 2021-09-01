import { WebExecutor } from './WebExecutor';

/**
 * A wrapper for the web-based filesystem
 */
export class FS {
  /**
   * Read a file as a string or return `null` if the file doesn't exist
   */
  public static readFile(path: string): Promise<string | null> {
    return WebExecutor.exec<string | null>(
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
