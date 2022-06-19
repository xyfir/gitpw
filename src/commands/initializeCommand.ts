import { writeJSON, writeFile, readdir, mkdir } from 'fs-extra';
import { getGpwPath } from '../utils/getGpwPath';
import { GpwPBKDF2 } from '../utils/GpwPBKDF2';
import { GpwCrypto } from '../utils/GpwCrypto';
import { promisify } from 'util';
import { getPath } from '../utils/getPath';
import { nanoid } from 'nanoid';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import {
  GpwUnlockedKeychain,
  GpwLockedKeychain,
  GpwRepoManifest,
  GpwKeyType,
  GpwKey,
} from '../types';

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

  // Ask the user how many keys they want to encrypt their repo with
  const { keyCount } = await inquirer.prompt<{ keyCount: number }>([
    {
      message: '# of keys to encrypt with',
      default: 1,
      name: 'keyCount',
      type: 'number',
    },
  ]);

  // Prompt for key types and their corresponding passwords
  const questions: inquirer.Question[] = [];
  for (let i = 0; i < keyCount; i++) {
    questions.push({
      message: `Type of key #${i + 1}`,
      choices: ['XChaCha20-Poly1305', 'AES-256-GCM'] as GpwKeyType[],
      default: (i == 0 ? 'AES-256-GCM' : 'XChaCha20-Poly1305') as GpwKeyType,
      name: `keyType${i}`,
      type: 'list',
    } as inquirer.ListQuestion);
    questions.push({
      message: `Password for key #${i + 1}`,
      choices: ['XChaCha20-Poly1305', 'AES-256-GCM'] as GpwKeyType[],
      default: (i == 0 ? 'AES-256-GCM' : 'XChaCha20-Poly1305') as GpwKeyType,
      name: `keyPass${i}`,
      type: 'password',
    } as inquirer.PasswordQuestion);
  }
  const answers = await inquirer.prompt(questions);

  // Ask if we should configure the repo for VS Code
  const { vsCode } = await inquirer.prompt<{ vsCode: boolean }>([
    {
      message: 'Configure for VS Code?',
      default: false,
      type: 'confirm',
      name: 'vsCode',
    },
  ]);

  // Create repo manifest
  const manifest: GpwRepoManifest = {
    locked_keychains: [],
    key_stretchers: Array(keyCount)
      .fill(0)
      .map(() => ({
        iterations: GpwPBKDF2.generateIterations(),
        type: 'PBKDF2-SHA-512',
        salt: GpwPBKDF2.generateSalt(),
      })),
    version: 'com.xyfir.gitpw/0.0.0',
  };

  // Derive keys from passwords
  const passkeys = await Promise.all(
    manifest.key_stretchers.map((stretcher, i) =>
      GpwPBKDF2.deriveKey(
        answers[`keyPass${i}`] as string,
        stretcher.salt,
        stretcher.iterations,
      ),
    ),
  );

  // Create un/locked keychains
  const keychain: GpwUnlockedKeychain = {
    keys: Array(keyCount)
      .fill(0)
      .map(
        (_, i): GpwKey => ({
          type: answers[`keyType${i}`] as GpwKeyType,
          data: passkeys[i],
        }),
      ),
    id: nanoid(),
  };
  const lockedKeychain = JSON.parse(
    JSON.stringify(keychain),
  ) as GpwLockedKeychain;
  for (const key of lockedKeychain.keys) {
    key.data = await GpwCrypto.encrypt(key.data, keychain);
  }
  manifest.locked_keychains.push(lockedKeychain);

  // Write files
  await writeJSON(getGpwPath('manifest.json'), manifest, { spaces: 2 });
  await writeJSON(getGpwPath('map.json'), {}, { spaces: 2 });
  await writeFile(
    getPath('.gitignore'),
    ['/*', '!/.gitignore', vsCode ? '!/.vscode/' : '', '!/.gitpw/']
      .filter(Boolean)
      .join('\n'),
  );

  // Configure for VS Code:
  // - Only search non-config plaintext ignored by git
  if (vsCode) {
    await mkdir(getPath('.vscode'));
    await writeJSON(
      getPath('.vscode/settings.json'),
      {
        'search.useIgnoreFiles': false,
        'search.exclude': {
          '.gitignore': true,
          '.vscode': true,
          '.gitpw': true,
        },
      },
      { spaces: 2 },
    );
  }

  console.log('Initialized gitpw repo');
}
