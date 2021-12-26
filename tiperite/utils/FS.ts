import { PromiseFsClient } from 'isomorphic-git';
import LightningFS from '@isomorphic-git/lightning-fs';
import { JSONString } from '../types';

/**
 * Wrapper for the IndexedDB-based filesystem, LightningFS, based on Node's `fs`
 *
 * @see https://github.com/isomorphic-git/lightning-fs
 * @see https://nodejs.org/api/fs.html
 */
export class FS {
  public static fs = new LightningFS('git') as PromiseFsClient;

  /**
   * Write a file as a string
   */
  public static writeFile(path: string, data: string): Promise<void> {
    return this.fs.promises.writeFile(path, data);
  }

  /**
   * Write a file as JSON
   */
  public static writeJSON<T>(path: string, data: T): Promise<void> {
    return this.writeFile(path, JSON.stringify(data, null, 2));
  }

  /**
   * Read a file as a string or return `null` if the file doesn't exist
   */
  public static readFile<T extends string>(path: string): Promise<T | null> {
    return this.fs.promises
      .readFile(path, 'utf8')
      .catch((e: { code: string }) => {
        if (e.code == 'ENOENT') return null;
        throw e;
      });
  }

  /**
   * Read a file as JSON or return `null` if the file doesn't exist
   */
  public static readJSON<T>(path: string): Promise<T | null> {
    return this.readFile<JSONString>(path).then((data) => {
      if (!data) return null;
      return JSON.parse(data) as T;
    });
  }

  /**
   * List the files in a directory (unsorted)
   */
  public static readdir(path: string): Promise<string[]> {
    return this.fs.promises.readdir(path);
  }

  /**
   * Delete a file
   */
  public static unlink(path: string): Promise<void> {
    return this.fs.promises.unlink(path);
  }

  /**
   * Delete a directory
   */
  public static rmdir(path: string): Promise<void> {
    return this.fs.promises.rmdir(path);
  }
}
