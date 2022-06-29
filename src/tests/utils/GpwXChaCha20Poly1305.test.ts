import { GpwXChaCha20Poly1305 } from '../../utils/GpwXChaCha20Poly1305';
import { GpwPBKDF2 } from '../../utils/GpwPBKDF2';

test('GpwXChaCha20Poly1305', async () => {
  const plaintext = 'Hello, World!';
  const plaintextBuf = Buffer.from(plaintext, 'utf-8');

  const passkey = await GpwPBKDF2.deriveKey(
    'password',
    GpwPBKDF2.generateSalt(),
    GpwPBKDF2.generateIterations(true),
  ).then((p) => Buffer.from(p, 'base64'));

  const ciphertext = await GpwXChaCha20Poly1305.encrypt(
    plaintextBuf,
    passkey,
  ).then((c) => c.toString('base64'));
  const ciphertext2 = await GpwXChaCha20Poly1305.encrypt(
    plaintextBuf,
    passkey,
  ).then((c) => c.toString('base64'));

  const decrypted = await GpwXChaCha20Poly1305.decrypt(
    Buffer.from(ciphertext, 'base64'),
    passkey,
  ).then((d) => d.toString('utf-8'));

  expect(ciphertext).not.toBe(ciphertext2);
  expect(ciphertext).not.toBe(plaintext);
  expect(decrypted).toBe(plaintext);
});
