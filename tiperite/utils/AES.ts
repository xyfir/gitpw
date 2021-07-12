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
        // Generate a random IV and set our algo config
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const alg = { name: 'AES-GCM', iv };

        // Convert the key's hex string into a CryptoKey
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          new Uint8Array(
            params.keyHex.match(/.{2}/g).map((byte) => parseInt(byte, 16))
          ),
          alg,
          false,
          ['encrypt'],
        );

        // Convert plaintext to binary and encrypt it
        const ciphertextBuffer = await crypto.subtle.encrypt(
          alg,
          cryptoKey,
          new TextEncoder().encode(params.plaintext),
        );

        // Convert ciphertext to a base64 string
        const ctBase64 = btoa(
          Array.from(new Uint8Array(ciphertextBuffer))
            .map((byte) => String.fromCharCode(byte))
            .join(''),
        );

        // Convert IV to a hex string
        const ivHex = Array.from(iv)
          .map((b) => ('00' + b.toString(16)).slice(-2))
          .join('');

        return ivHex + ctBase64;
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
        // Extract IV from ciphertext
        const iv = params.ciphertext
          .slice(0, 24)
          .match(/.{2}/g)
          .map((byte) => parseInt(byte, 16));

        // Configure algo
        const alg = { name: 'AES-GCM', iv: new Uint8Array(iv) };

        // Convert the key's hex string into a CryptoKey
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          new Uint8Array(
            params.keyHex.match(/.{2}/g).map((byte) => parseInt(byte, 16))
          ),
          alg,
          false,
          ['decrypt'],
        );

        // Convert ciphertext to binary and decrypt it
        const plainBuffer = await crypto.subtle.decrypt(
          alg,
          cryptoKey,
          new Uint8Array(
            atob(params.ciphertext.slice(24))
              // Note that we're in a template string and need to double escape
              .match(/[\\s\\S]/g)
              .map((ch) => ch.charCodeAt(0)),
          ),
        );

        // Convert and return decrypted binary to text
        return new TextDecoder().decode(plainBuffer);
      `,
      {
        ciphertext,
        keyHex,
      },
    ).promise;
  }
}
