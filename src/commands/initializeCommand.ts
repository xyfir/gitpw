import { GpwRepoManifest, GpwKeychain } from '../types';
import { writeJSON, mkdir } from 'fs-extra';
import { createInterface } from 'readline';
import { getGpwPath } from '../utils/getGpwPath';
import { TrPBKDF2 } from '../utils/TrPBKDF2';
import { TrCrypto } from '../utils/TrCrypto';
import { nanoid } from 'nanoid';

export async function initializeCommand(): Promise<void> {
  // Create .gitpw directories
  await mkdir(getGpwPath(''));
  await mkdir(getGpwPath('files'));

  // Prompt for password
  const cli = createInterface({
    output: process.stdout,
    input: process.stdin,
  });
  const password = await new Promise<string>((resolve) => {
    cli.question('Create password:', resolve);
  });
  cli.close();

  // Create repo manifest
  const manifest: GpwRepoManifest = {
    locked_keychains: [],
    key_stretchers: [
      {
        iterations: TrPBKDF2.generateIterations(),
        type: 'PBKDF2-SHA-512',
        salt: TrPBKDF2.generateSalt(),
        id: nanoid(),
      },
    ],
    version: 'com.xyfir.gitpw/1.0.0',
  };

  // Derive key from password
  const passkey = await TrPBKDF2.deriveKey(
    password,
    manifest.key_stretchers[0].salt,
    manifest.key_stretchers[0].iterations,
  );

  // Create locked keychain
  const keychain: GpwKeychain = {
    created_at: new Date().toISOString(),
    keys: [{ data: passkey, type: 'AES-256-GCM' }],
    id: nanoid(),
  };
  keychain.keys[0].data = await TrCrypto.encrypt(passkey, keychain);
  manifest.locked_keychains.push(keychain);

  // Write files
  await writeJSON(getGpwPath('manifest.json'), manifest);
  await writeJSON(getGpwPath('map.json'), {});
}
