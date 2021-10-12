import { convertBufferToArrayBuffer } from './convertBufferToArrayBuffer';
import { EncryptedString, HexString } from '../types';

/**
 * AES-256 GCM utility based on web crypto
 */
export class AES {
  /**
   * Encrypts plaintext using AES-256 GCM
   */
  public static async encrypt(
    plaintext: string,
    keyHex: HexString,
  ): Promise<EncryptedString> {
    // Generate a random IV and set our algo config
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const alg = { name: 'AES-GCM', iv };

    // Convert the key's hex string into a CryptoKey
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      convertBufferToArrayBuffer(Buffer.from(keyHex, 'hex')),
      alg,
      false,
      ['encrypt'],
    );

    // Convert plaintext to binary and encrypt it
    const ciphertextBuffer = await crypto.subtle.encrypt(
      alg,
      cryptoKey,
      new TextEncoder().encode(plaintext),
    );

    // Convert ciphertext to a base64 string
    const ctBase64 = Buffer.from(ciphertextBuffer).toString('base64');

    // Convert IV to a hex string
    const ivHex = Buffer.from(iv).toString('hex');

    return ivHex + ctBase64;
  }

  /**
   * Decrypts AES-256 GCM ciphertext
   */
  public static async decrypt(
    ciphertext: EncryptedString,
    keyHex: HexString,
  ): Promise<string> {
    // Extract IV from ciphertext
    const iv = convertBufferToArrayBuffer(
      Buffer.from(ciphertext.slice(0, 24), 'hex'),
    );
    const alg = { name: 'AES-GCM', iv };

    // Convert the key's hex string into a CryptoKey
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      convertBufferToArrayBuffer(Buffer.from(keyHex, 'hex')),
      alg,
      false,
      ['decrypt'],
    );

    // Convert ciphertext to binary and decrypt it
    const plainBuffer = await crypto.subtle.decrypt(
      alg,
      cryptoKey,
      new Uint8Array(
        (
          window.atob(ciphertext.slice(24)).match(/[\s\S]/g) as RegExpMatchArray
        ).map((ch) => ch.charCodeAt(0)),
      ),
    );

    // Convert and return decrypted binary to text
    return new TextDecoder().decode(plainBuffer);
  }
}
