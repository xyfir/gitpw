import { EncryptedString, HexString } from '../types';
import { WebExecutor } from './WebExecutor';

/**
 * AES-256 GCM utility based on web crypto running in `WebExecutor`
 */
export class AES {
  /**
   * Encrypts plaintext using AES-256 GCM
   */
  public static encrypt(
    plaintext: string,
    keyHex: HexString,
  ): Promise<EncryptedString> {
    return WebExecutor.exec<string>(
      /* js */ `
        return AESWeb.encrypt(params);
      `,
      {
        plaintext,
        keyHex,
      },
    ).promise;
  }

  /**
   * Decrypts AES-256 GCM ciphertext
   */
  public static async decrypt(
    ciphertext: EncryptedString,
    keyHex: HexString,
  ): Promise<string> {
    return WebExecutor.exec<string>(
      /* js */ `
        return AESWeb.decrypt(params);
      `,
      {
        ciphertext,
        keyHex,
      },
    ).promise;
  }
}
