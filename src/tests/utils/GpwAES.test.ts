import { GpwPBKDF2 } from '../../utils/GpwPBKDF2';
import { GpwAES } from '../../utils/GpwAES';

test('GpwAES', async () => {
  const plaintext = 'Hello, World!';
  const plaintextBuf = Buffer.from(plaintext, 'utf-8');

  const passkey = await GpwPBKDF2.deriveKey(
    'password',
    GpwPBKDF2.generateSalt(),
    GpwPBKDF2.generateIterations(true),
  ).then((p) => Buffer.from(p, 'base64'));

  const ciphertext = await GpwAES.encrypt(plaintextBuf, passkey).then((c) =>
    c.toString('base64'),
  );
  const ciphertext2 = await GpwAES.encrypt(plaintextBuf, passkey).then((c) =>
    c.toString('base64'),
  );
  const decrypted = await GpwAES.decrypt(
    Buffer.from(ciphertext, 'base64'),
    passkey,
  ).then((d) => d.toString('utf-8'));

  expect(ciphertext).not.toBe(ciphertext2);
  expect(ciphertext).not.toBe(plaintext);
  expect(decrypted).toBe(plaintext);
});
