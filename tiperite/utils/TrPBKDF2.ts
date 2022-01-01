import { convertBufferToArrayBuffer } from './convertBufferToArrayBuffer';
import { HexString } from '../types';

/**
 * Derive key from a user-supplied password using PBKDF2
 */
export class TrPBKDF2 {
  /**
   * Randomly generate iterations count for PBKDF2
   *
   * **Min:** 1,000,000\
   * **Max:** 1,099,999
   */
  public static generateIterations(): number {
    return 1000000 + Number(Math.random().toString().slice(-5));
  }

  /**
   * Generate a random 16-byte salt as a hexstring
   */
  public static generateSalt(): HexString {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return Buffer.from(salt).toString('hex');
  }

  /**
   * Uses web's `SubtleCrypto` PBKDF2 interface to convert a password to a key
   */
  public static async deriveKey(
    pass: string,
    salt: HexString,
    itr: number,
  ): Promise<HexString> {
    const saltBuffer = convertBufferToArrayBuffer(Buffer.from(salt, 'hex'));
    const passBuffer = new TextEncoder().encode(pass);

    const key = await crypto.subtle.importKey(
      'raw',
      passBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey'],
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
      ['encrypt', 'decrypt'],
    );

    const keyBuffer = await crypto.subtle.exportKey('raw', derivedKey);
    return Buffer.from(keyBuffer).toString('hex');
  }
}
