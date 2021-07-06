import { WebExecutor } from './WebExecutor';

/**
 * Derive key from a user-supplied password
 */
export class KeyDeriver {
  /**
   * Randomly generate iterations count for PBKDF2
   *
   * **Min:** 1,000,000\
   * **Max:** 1,099,999
   */
  public static generateIterationsCount(): number {
    return 1000000 + +Math.random().toString().slice(-5);
  }

  /**
   * Generate a random 16-byte salt and convert to string
   */
  public static generateSalt(): Promise<string> {
    return WebExecutor.exec<string>(/* js */ `
    return String.fromCharCode.apply(
      null,
      crypto.getRandomValues(new Uint8Array(16)),
    );
  `).promise;
  }

  /**
   * Uses web's `SubtleCrypto` PBKDF2 interface to convert a password to a key
   * @return derived key as a hex string
   */
  public static deriveKey(
    pass: string,
    salt: string,
    itr: number,
  ): Promise<string> {
    // Convert these to base64 just to transfer them into WebExecutor without
    // unexpected characters breaking our code
    pass = Buffer.from(pass, 'utf8').toString('base64');
    salt = Buffer.from(salt, 'utf8').toString('base64');

    return WebExecutor.exec<string>(`
      function toBase64(arr) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            () => resolve(reader.result),
            false
          );
          reader.readAsDataURL(new Blob([arr]));
        });
      }

      const passBuffer = new TextEncoder('utf-8').encode(btoa('${pass}'));
      const saltBuffer = new TextEncoder('utf-8').encode(btoa('${salt}'));

      const key = await crypto.subtle.importKey(
        'raw',
        passBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const derivedKey = await crypto.subtle.deriveKey(
        {
          iterations: ${itr},
          salt: saltBuffer,
          hash: 'SHA-512',
          name: 'PBKDF2',
        },
        key,
        {
          length: 256,
          name: 'AES-GCM',
        },
        true,
        ['encrypt', 'decrypt']
      );

      const keyBuffer = await crypto.subtle.exportKey('raw', derivedKey);

      return await toBase64(keyBuffer);
   `).promise;
  }
}
