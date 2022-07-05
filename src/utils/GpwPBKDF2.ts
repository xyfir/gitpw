import type { GpwBase64String } from '../types';
import { crypto } from './crypto';

/**
 * Derive key from a user-supplied password using PBKDF2
 */
export class GpwPBKDF2 {
  /**
   * Randomly generate iterations count for PBKDF2
   *
   * **Min:** 1,000,000\
   * **Max:** 1,099,999
   *
   * @param easy only intended to be true during testing for speed improvements
   */
  public static generateIterations(easy = false): number {
    return easy
      ? Number(Math.random().toString().slice(-2))
      : 1000000 + Number(Math.random().toString().slice(-5));
  }

  /**
   * Generate a random 16-byte salt as base64
   */
  public static generateSalt(): GpwBase64String {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return Buffer.from(salt).toString('base64');
  }

  /**
   * Uses web's `SubtleCrypto` PBKDF2 interface to convert a password to a key
   */
  public static async deriveKey(
    pass: string,
    salt: GpwBase64String,
    itr: number,
  ): Promise<GpwBase64String> {
    const saltBuffer = Buffer.from(salt, 'base64');
    const passBuffer = Buffer.from(pass, 'utf-8');

    const key = await crypto.subtle.importKey(
      'raw',
      passBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveKey'],
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        iterations: +itr,
        salt: saltBuffer,
        hash: 'SHA-512',
        name: 'PBKDF2',
      },
      key,
      {
        length: 256,
        name: 'AES-GCM',
      },
      true,
      [],
    );

    const keyBuffer = await crypto.subtle.exportKey('raw', derivedKey);
    return Buffer.from(keyBuffer).toString('base64');
  }
}
