import type { GpwUnlockedKeychain, GpwRepoManifest, Session } from '../types';
import { getGpwPath } from './getGpwPath';
import { GpwPBKDF2 } from './GpwPBKDF2';
import { readJSON } from 'fs-extra';
import inquirer from 'inquirer';

export async function getSession(): Promise<Session> {
  // Get manifest
  const manifest: GpwRepoManifest = await readJSON(getGpwPath('manifest.json'));

  // Prompt user for repo's passwords
  const passwords: string[] = [];
  for (let i = 0; i < manifest.key_stretchers.length; i++) {
    await inquirer
      .prompt<{ pass: string }>([
        {
          message: `Password for key #${i + 1}`,
          type: 'password',
          name: 'pass',
        },
      ])
      .then((answers) => passwords.push(answers.pass));
  }

  // Derive keys from passwords
  const passkeys = await Promise.all(
    manifest.key_stretchers.map((stretcher, i) =>
      GpwPBKDF2.deriveKey(passwords[i], stretcher.salt, stretcher.iterations),
    ),
  );

  // Create unlocked keychain
  const keychain = JSON.parse(
    JSON.stringify(manifest.locked_keychains[0]),
  ) as GpwUnlockedKeychain;
  for (let i = 0; i < keychain.keys.length; i++) {
    keychain.keys[i].data = passkeys[i];
  }

  return {
    ...manifest,
    unlocked_keychain: keychain,
  };
}
