import { GpwKeychain } from '../../types';
import { GpwPBKDF2 } from '../../utils/GpwPBKDF2';
import { GpwCrypto } from '../../utils/GpwCrypto';

test('GpwCrypto with AES-256-GCM', async () => {
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
  };

  const ciphertext = await GpwCrypto.encrypt(plaintext, keychain);
  const ciphertext2 = await GpwCrypto.encrypt(plaintext, keychain);
  const decrypted = await GpwCrypto.decrypt(ciphertext, keychain);

  expect(ciphertext).not.toBe(ciphertext2);
  expect(ciphertext).not.toBe(plaintext);
  expect(decrypted).toBe(plaintext);
});

test('GpwCrypto with XChaCha20-Poly1305', async () => {
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
        type: 'XChaCha20-Poly1305',
        data: passkey,
      },
    ],
  };

  const ciphertext = await GpwCrypto.encrypt(plaintext, keychain);
  const ciphertext2 = await GpwCrypto.encrypt(plaintext, keychain);
  const decrypted = await GpwCrypto.decrypt(ciphertext, keychain);

  expect(ciphertext).not.toBe(ciphertext2);
  expect(ciphertext).not.toBe(plaintext);
  expect(decrypted).toBe(plaintext);
});
