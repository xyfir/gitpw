import { WebExecutor } from './WebExecutor';

export function getKeyFromPassword(
  pass: string,
  salt: string,
  itr: number,
): Promise<string> {
  pass = Buffer.from(pass, 'utf8').toString('base64');

  return WebExecutor.exec<string>(`
    async function sha512(message) {
      const hashBuffer = await crypto.subtle.digest(
        'SHA-512',
        new TextEncoder().encode(message)
      );
      const hashHex = Array.from(new Uint8Array(hashBuffer)).map(
        b => b.toString(16).padStart(2, '0')
      ).join('');
      return hashHex;
    }

    let key = '${pass}';

    for (let i = 0; i < ${itr}; i++) {
      key = await sha512('${salt}' + key);
    }

    return key;
  `).promise;
}
