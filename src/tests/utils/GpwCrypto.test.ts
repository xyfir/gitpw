import { GpwKeychain } from '../../types';
import { GpwPBKDF2 } from '../../utils/GpwPBKDF2';
import { GpwCrypto } from '../../utils/GpwCrypto';
import { nanoid } from 'nanoid';

test('GpwCrypto', async () => {
  const plaintext = 'Hello, World!';
  const passkey = await GpwPBKDF2.deriveKey(
    'password',
    GpwPBKDF2.generateSalt(),
    GpwPBKDF2.generateIterations(),
  );
  const keychain: GpwKeychain = {
    created_at: new Date().toISOString(),
    keys: [
      {
        type: 'AES-256-GCM',
        data: passkey,
      },
    ],
    id: nanoid(),
  };

  const ciphertext = await GpwCrypto.encrypt(plaintext, keychain);
  const ciphertext2 = await GpwCrypto.encrypt(plaintext, keychain);
  const decrypted = await GpwCrypto.decrypt(ciphertext, keychain);

  expect(ciphertext).not.toBe(ciphertext2);
  expect(ciphertext).not.toBe(plaintext);
  expect(decrypted).toBe(plaintext);
});
