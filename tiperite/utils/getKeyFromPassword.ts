import { WebExecutor } from './WebExecutor';

/**
 * Uses web's `SubtleCrypto` PBKDF2 API to convert a password to a key.
 * @return base64 URL of the derived key
 */
export function getKeyFromPassword(
  pass: string,
  salt: string,
  itr: number,
): Promise<string> {
  pass = Buffer.from(pass, 'utf8').toString('base64');

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
