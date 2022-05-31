import { GpwPBKDF2 } from '../../utils/GpwPBKDF2';
import { GpwAES } from '../../utils/GpwAES';

test('GpwAES', async () => {
  const plaintext = 'Hello, World!';
  const passkey = await GpwPBKDF2.deriveKey(
    'password',
    GpwPBKDF2.generateSalt(),
    GpwPBKDF2.generateIterations(),
  );
  const ciphertext = await GpwAES.encrypt(plaintext, passkey);
  const ciphertext2 = await GpwAES.encrypt(plaintext, passkey);
  const decrypted = await GpwAES.decrypt(ciphertext, passkey);

  expect(ciphertext).not.toBe(ciphertext2);
  expect(ciphertext).not.toBe(plaintext);
  expect(decrypted).toBe(plaintext);
});
