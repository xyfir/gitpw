import { GpwUnlockedKeychain, GpwEncryptedString } from '../types';
import { GpwXChaCha20Poly1305 } from './GpwXChaCha20Poly1305';
import { GpwAES } from './GpwAES';

/**
 * A high-level wrapper for encrypting and decrypting data using keychains.
 */
export class GpwCrypto {
  /**
   * Encrypts plaintext with provided keychain
   */
  public static async encrypt(
    plaintext: string,
    keychain: GpwUnlockedKeychain,
  ): Promise<GpwEncryptedString> {
    let temp = plaintext;

    for (const key of keychain.keys) {
      switch (key.type) {
        case 'XChaCha20-Poly1305':
          temp = await GpwXChaCha20Poly1305.encrypt(temp, key.data);
          break;
        case 'AES-256-GCM':
          temp = await GpwAES.encrypt(temp, key.data);
          break;
        default:
          throw Error('Invalid encryption type');
      }
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
      switch (key.type) {
        case 'XChaCha20-Poly1305':
          temp = await GpwXChaCha20Poly1305.decrypt(temp, key.data);
          break;
        case 'AES-256-GCM':
          temp = await GpwAES.decrypt(temp, key.data);
          break;
        default:
          throw Error('Invalid encryption type');
      }
    }

    return temp;
  }
}
