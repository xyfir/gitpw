import { HexString } from '../types';

/**
 * Derive key from a user-supplied password
 */
export class KeyDeriver {
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
   * Generate a random 16-byte salt and convert to string
   */
  public static generateSalt(): string {
    let salt = '';
    crypto.getRandomValues(new Uint8Array(16)).forEach((byte) => {
      salt += String.fromCharCode(byte);
    });
    return salt;
  }

  /**
   * Uses web's `SubtleCrypto` PBKDF2 interface to convert a password to a key
   */
  public static async deriveKey({
    pass,
    salt,
    itr,
  }: {
    pass: string;
    salt: string;
    itr: number;
  }): Promise<HexString> {
    const passBuffer = new TextEncoder().encode(pass);
    const saltBuffer = new TextEncoder().encode(salt);

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
