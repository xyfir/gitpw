import { GpwXChaCha20Poly1305 } from '../../utils/GpwXChaCha20Poly1305';
import { GpwPBKDF2 } from '../../utils/GpwPBKDF2';

test('GpwXChaCha20Poly1305', async () => {
  const plaintext = 'Hello, World!';
  const passkey = await GpwPBKDF2.deriveKey(
    'password',
    GpwPBKDF2.generateSalt(),
    GpwPBKDF2.generateIterations(true),
  );
  const ciphertext = await GpwXChaCha20Poly1305.encrypt(plaintext, passkey);
  const ciphertext2 = await GpwXChaCha20Poly1305.encrypt(plaintext, passkey);
  const decrypted = await GpwXChaCha20Poly1305.decrypt(ciphertext, passkey);

  expect(ciphertext).not.toBe(ciphertext2);
  expect(ciphertext).not.toBe(plaintext);
  expect(decrypted).toBe(plaintext);
});
