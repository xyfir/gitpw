import { GpwEncryptedString, GpwBase64String } from '../types';
import { XChaCha20Poly1305 } from '@stablelib/xchacha20poly1305';
import { crypto } from './crypto';

/**
 * Utility class for XChaCha20-Poly1305 encryption
 *
 * @see https://github.com/StableLib/stablelib/tree/master/packages/xchacha20poly1305
 */
export class GpwXChaCha20Poly1305 {
  /**
   * Encrypts plaintext using XChaCha20-Poly1305
   */
  public static async encrypt(
    plaintext: string,
    b64Key: GpwBase64String,
  ): Promise<GpwEncryptedString> {
    const nonce = crypto.getRandomValues(new Uint8Array(24));

    const xcha = new XChaCha20Poly1305(Buffer.from(b64Key, 'base64'));
    const sealed = xcha.seal(nonce, new TextEncoder().encode(plaintext));

    const ctBase64 = Buffer.from(sealed).toString('base64');
    const b64Nonce = Buffer.from(nonce).toString('base64');

    return `${b64Nonce} ${ctBase64}`;
  }

  /**
   * Decrypts ciphertext using XChaCha20-Poly1305
   */
  public static async decrypt(
    ciphertext: GpwEncryptedString,
    b64Key: GpwBase64String,
  ): Promise<string> {
    const [b64Nonce, b64ciphertext] = ciphertext.split(' ');

    const xcha = new XChaCha20Poly1305(Buffer.from(b64Key, 'base64'));
    const opened = xcha.open(
      Buffer.from(b64Nonce, 'base64'),
      Buffer.from(b64ciphertext, 'base64'),
    );

    if (opened === null) throw Error('Could not decrypt');

    return new TextDecoder().decode(opened);
  }
}
