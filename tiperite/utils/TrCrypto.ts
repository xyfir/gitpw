import { EncryptedString, EncryptionKey } from '../types';
import { TrAES } from './TrAES';

/**
 * A high-level wrapper for encrypting and decrypting data using Tiperite's
 *  `EncryptionKey` arrays.
 *
 * @see EncryptionKey
 */
export class TrCrypto {
  /**
   * Encrypts plaintext with provided keys
   */
  public static async encrypt(
    plaintext: string,
    keys: EncryptionKey[],
  ): Promise<EncryptedString> {
    let temp = plaintext;

    for (const key of keys) {
      if (key.type != 'AES-256-GCM') throw Error('Invalid encryption type');

      temp = await TrAES.encrypt(temp, key.passkey);
    }

    return temp;
  }

  /**
   * Decrypts ciphertext with provided keys
   */
  public static async decrypt(
    ciphertext: EncryptedString,
    keys: EncryptionKey[],
  ): Promise<string> {
    let temp = ciphertext;
    keys = keys.slice().reverse();

    for (const key of keys) {
      if (key.type != 'AES-256-GCM') throw Error('Invalid encryption type');

      temp = await TrAES.decrypt(temp, key.passkey);
    }

    return temp;
  }
}
