import { GpwUnlockedKeychain, GpwEncryptedString } from '../types';
import { TrAES } from './TrAES';

/**
 * A high-level wrapper for encrypting and decrypting data using Tiperite's
 *  `EncryptionKey` arrays.
 *
 * @see EncryptionKey
 */
export class TrCrypto {
  /**
   * Encrypts plaintext with provided keychain
   */
  public static async encrypt(
    plaintext: string,
    keychain: GpwUnlockedKeychain,
  ): Promise<GpwEncryptedString> {
    let temp = plaintext;

    for (const key of keychain.keys) {
      if (key.type != 'AES-256-GCM') throw Error('Invalid encryption type');

      temp = await TrAES.encrypt(temp, key.data);
    }

    return temp;
  }

  /**
   * Decrypts ciphertext with provided keys
   */
  public static async decrypt(
    ciphertext: GpwEncryptedString,
    keychain: GpwUnlockedKeychain,
  ): Promise<string> {
    let temp = ciphertext;
    const keys = keychain.keys.slice().reverse();

    for (const key of keys) {
      if (key.type != 'AES-256-GCM') throw Error('Invalid encryption type');

      temp = await TrAES.decrypt(temp, key.data);
    }

    return temp;
  }
}
