import { crypto } from './crypto';

/**
 * Utility class for AES-256 GCM encryption
 */
export class GpwAES {
  /**
   * Encrypt using AES-256 GCM
   */
  public static async encrypt(data: Buffer, key: Buffer): Promise<Buffer> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const alg = { name: 'AES-GCM', iv };

    const cryptoKey = await crypto.subtle.importKey('raw', key, alg, false, [
      'encrypt',
    ]);

    const sealed = await crypto.subtle.encrypt(alg, cryptoKey, data);

    return Buffer.concat([iv, Buffer.from(sealed)]);
  }

  /**
   * Decrypt using AES-256 GCM
   */
  public static async decrypt(data: Buffer, key: Buffer): Promise<Buffer> {
    const iv = data.slice(0, 12);
    const alg = { name: 'AES-GCM', iv };

    const cryptoKey = await crypto.subtle.importKey('raw', key, alg, false, [
      'decrypt',
    ]);

    const opened = await crypto.subtle.decrypt(alg, cryptoKey, data.slice(12));
    return Buffer.from(opened);
  }
}
