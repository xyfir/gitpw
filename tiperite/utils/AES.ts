import { WebExecutor } from './WebExecutor';

/**
 * AES-256 GCM utility based on web crypto running in `WebExecutor`
 *
 * Code extensively copied from Chris Veness
 * @see https://gist.github.com/chrisveness/43bcda93af9f646d083fad678071b90a
 */
export class AES {
  /**
   * Encrypts plaintext using AES-256 GCM
   *
   * @param plaintext Plaintext to be encrypted
   * @param keyHex Hex string of derived key
   *
   * @returns `${ivHex}${cipherTextBase64}`
   */
  public static encrypt(plaintext: string, keyHex: string): Promise<string> {
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
   *
   * @param ciphertext Ciphertext to be decrypted
   * @param keyHex Hex string of derived key
   */
  public static async decrypt(
    ciphertext: string,
    keyHex: string,
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
