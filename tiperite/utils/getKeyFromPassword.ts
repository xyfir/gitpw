import { WebExecutor } from './WebExecutor';

export function getKeyFromPassword(
  pass: string,
  salt: string,
  itr: number,
): Promise<string> {
  pass = Buffer.from(pass, 'utf8').toString('base64');

  return WebExecutor.exec<string>(`
    function bytesToHexString(bytes) {
      if (!bytes) return null;

      bytes = new Uint8Array(bytes);
      const hexBytes = [];

      for (var i = 0; i < bytes.length; ++i) {
        let byteString = bytes[i].toString(16);
        if (byteString.length < 2) byteString = '0' + byteString;
        hexBytes.push(byteString);
      }

      return hexBytes.join('');
    }

    function toBase64(arr) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => resolve(reader.result.split(',')[1]),
          false
        );
        reader.readAsDataURL(new Blob([arr]));
      });
    }

    const passphraseKey = new TextEncoder('utf-8').encode(btoa('${pass}'));
    const saltBuffer = crypto.getRandomValues(new Uint8Array(16));

    const key = await crypto.subtle.importKey(
      'raw',
      passphraseKey,
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

    return {
      salt: await toBase64(saltBuffer),
      key: await toBase64(keyBuffer),
    }
  `).promise;
}
