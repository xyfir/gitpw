import { getUnlockedFileMap } from '../utils/getUnlockedFileMap.js';
import { initCommand } from '../commands/initCommand.js';
import { runCommand } from '../commands/runCommand.js';
import { getSession } from '../utils/getSession.js';
import { getPath } from '../utils/getPath.js';
import { resolve } from 'path';
import { crypto } from '../utils/crypto.js';
import { tmpdir } from 'os';
import fs from 'fs-extra';

beforeAll(async () => {
  // Hijack process.cwd() and send it to a temp dir
  const uuid = crypto.randomUUID();
  process.cwd = () => resolve(tmpdir(), uuid);
  await fs.mkdir(process.cwd());
});

/**
 * @todo test file timestamps plaintext->encrypted
 * @todo test file timestamps encrypted->plaintext
 * @todo test deleting tracked file
 */
test('cli', async () => {
  const password = ['hunter42', 'hunter24', 'pass123', 'pass456'];

  // Initialize repo
  await initCommand({
    encryption: [
      'AES-256-GCM',
      'XChaCha20-Poly1305',
      'AES-256-GCM',
      'XChaCha20-Poly1305',
    ],
    password,
    vscode: true,
  });

  // Write plaintext files
  await fs.writeFile(getPath('test.txt'), 'Hello World');
  await fs.mkdir(getPath('dir'));
  await fs.writeFile(getPath('dir/abc.md'), 'foo bar');

  // Save files
  await runCommand('save', undefined, { password });

  // Confirm that the plaintext files still exist
  let entries = await fs.readdir(getPath(''));
  expect(entries).toContain('test.txt');
  expect(entries).toContain('dir');

  // Confirm that file map was created and has both entries
  const session = await getSession({ password });
  let maps = await getUnlockedFileMap(session.unlocked_keychain);
  expect(Object.keys(maps.locked).length).toBe(2);
  expect(Object.keys(maps.unlocked).length).toBe(2);
  expect(Object.values(maps.unlocked).some((v) => v == '/test.txt')).toBe(true);
  expect(Object.values(maps.unlocked).some((v) => v == '/dir/abc.md')).toBe(
    true,
  );

  // Lock files
  await runCommand('lock', undefined, { password });

  // Confirm that the plaintext files no longer exist
  entries = await fs.readdir(getPath(''));
  expect(entries).not.toContain('test.txt');
  expect(entries).not.toContain('dir');

  // Unlock files
  await runCommand('unlock', undefined, { password });

  // Confirm plaintext files exist again with original content
  let content = await fs.readFile(getPath('test.txt'), 'utf8');
  expect(content).toBe('Hello World');
  content = await fs.readFile(getPath('dir/abc.md'), 'utf8');
  expect(content).toBe('foo bar');

  // Move file
  await runCommand('move', undefined, {
    password,
    source: 'test.txt',
    target: '/dir/test2.txt',
  });

  // Confirm that the plaintext file has been moved
  entries = await fs.readdir(getPath(''));
  expect(entries).not.toContain('test.txt');
  entries = await fs.readdir(getPath('dir'));
  expect(entries).toContain('test2.txt');

  // Confirm that filemap has been updated
  maps = await getUnlockedFileMap(session.unlocked_keychain);
  expect(Object.values(maps.unlocked).some((v) => v == '/dir/test2.txt')).toBe(
    true,
  );
}, 20_000);
