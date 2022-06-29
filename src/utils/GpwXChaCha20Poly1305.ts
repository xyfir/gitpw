import { XChaCha20Poly1305 } from '@stablelib/xchacha20poly1305';
import { crypto } from './crypto';

/**
 * Utility class for XChaCha20-Poly1305 encryption
 *
 * @see https://github.com/StableLib/stablelib/tree/master/packages/xchacha20poly1305
 */
export class GpwXChaCha20Poly1305 {
  /**
   * Encrypt using XChaCha20-Poly1305
   */
  public static async encrypt(data: Buffer, key: Buffer): Promise<Buffer> {
    const nonce = crypto.getRandomValues(new Uint8Array(24));

    const xcha = new XChaCha20Poly1305(key);
    const sealed = xcha.seal(nonce, data);

    return Buffer.concat([nonce, sealed]);
  }

  /**
   * Decrypt using XChaCha20-Poly1305
   */
  public static async decrypt(data: Buffer, key: Buffer): Promise<Buffer> {
    const xcha = new XChaCha20Poly1305(key);
    const opened = xcha.open(data.slice(0, 24), data.slice(24));

    if (opened === null) throw Error('Could not decrypt');

    return Buffer.from(opened);
  }
}
