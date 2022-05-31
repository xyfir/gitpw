import { writeJSON, writeFile, readdir, mkdir } from 'fs-extra';
import { GpwRepoManifest, GpwKeychain } from '../types';
import { createInterface } from 'readline';
import { getGpwPath } from '../utils/getGpwPath';
import { GpwPBKDF2 } from '../utils/GpwPBKDF2';
import { GpwCrypto } from '../utils/GpwCrypto';
import { promisify } from 'util';
import { getPath } from '../utils/getPath';
import { exec } from 'child_process';

const execp = promisify(exec);

export async function initializeCommand(): Promise<void> {
  // Check that the directory is empty
  const entries = await readdir(getPath(''));
  if (entries.some((e) => e != '.git')) throw Error('Directory is not empty');

  // Create .gitpw directories
  await mkdir(getGpwPath(''));
  await mkdir(getGpwPath('files'));

  // Run `git init` command
  await execp('git init');

  // Prompt for password
  const cli = createInterface({
    output: process.stdout,
    input: process.stdin,
  });
  const password = await new Promise<string>((resolve) => {
    cli.question('Create password:\n', resolve);
  });
  cli.close();

  // Create repo manifest
  const manifest: GpwRepoManifest = {
    locked_keychains: [],
    key_stretchers: [
      {
        iterations: GpwPBKDF2.generateIterations(),
        type: 'PBKDF2-SHA-512',
        salt: GpwPBKDF2.generateSalt(),
      },
    ],
    version: 'com.xyfir.gitpw/1.0.0',
  };

  // Derive key from password
  const passkey = await GpwPBKDF2.deriveKey(
    password,
    manifest.key_stretchers[0].salt,
    manifest.key_stretchers[0].iterations,
  );

  // Create locked keychain
  const keychain: GpwKeychain = {
    created_at: new Date().toISOString(),
    keys: [{ data: passkey, type: 'AES-256-GCM' }],
  };
  keychain.keys[0].data = await GpwCrypto.encrypt(passkey, keychain);
  manifest.locked_keychains.push(keychain);

  // Write files
  await writeJSON(getGpwPath('manifest.json'), manifest, { spaces: 2 });
  await writeJSON(getGpwPath('map.json'), {}, { spaces: 2 });
  await writeFile(
    getPath('.gitignore'),
    ['/*', '!/.gitignore', '!/.gitpw/'].join('\n'),
  );

  console.log('Initialized gitpw repo');
}
