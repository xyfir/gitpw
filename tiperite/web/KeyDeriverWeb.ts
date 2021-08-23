function convertBufferToBase64URL(arr: ArrayBuffer): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => resolve(reader.result as string),
      false,
    );
    reader.readAsDataURL(new Blob([arr]));
  });
}

/**
 * Derive key from a user-supplied password
 */
export class KeyDeriverWeb {
  /**
   * Generate a random 16-byte salt and convert to string
   */
  public static generateSalt(): string {
    let salt = '';
    crypto.getRandomValues(new Uint8Array(16)).forEach((byte) => {
      salt += String.fromCharCode(byte);
    });
    return salt;
  }

  /**
   * Uses web's `SubtleCrypto` PBKDF2 interface to convert a password to a key
   *
   * @return derived key as a hex string
   */
  public static async deriveKey({
    pass,
    salt,
    itr,
  }: {
    pass: string;
    salt: string;
    itr: number;
  }): Promise<string> {
    const passBuffer = new TextEncoder().encode(pass);
    const saltBuffer = new TextEncoder().encode(salt);

    const key = await crypto.subtle.importKey(
      'raw',
      passBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey'],
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        iterations: +itr,
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
      ['encrypt', 'decrypt'],
    );

    const keyBuffer = await crypto.subtle.exportKey('raw', derivedKey);
    return await convertBufferToBase64URL(keyBuffer);
  }
}
