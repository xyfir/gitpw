import LightningFS from '@isomorphic-git/lightning-fs';

/**
 * Wrapper for the IndexedDB-based filesystem, LightningFS, based on Node's `fs`
 *
 * @see https://github.com/isomorphic-git/lightning-fs
 * @see https://nodejs.org/api/fs.html
 */
export class FS {
  public static fs = new LightningFS('git');

  /**
   * Write a file as a string
   */
  public static writeFile(path: string, data: string): Promise<void> {
    return this.fs.promises.writeFile(path, data);
  }

  /**
   * Read a file as a string or return `null` if the file doesn't exist
   */
  public static readFile<T extends string>(path: string): Promise<T | null> {
    return this.fs.promises.readFile<T>(path, 'utf8').catch((e) => {
      if (e.code == 'ENOENT') return null;
      throw e;
    });
  }

  /**
   * Delete a file
   */
  public static unlink(path: string): Promise<void> {
    return this.fs.promises.unlink(path);
  }
}
