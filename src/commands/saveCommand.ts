import type { GpwFileMap, GpwFile, Session } from '../types/index.js';
import { getUnlockedFileMap } from '../utils/getUnlockedFileMap.js';
import { getGpwPath } from '../utils/getGpwPath.js';
import { GpwCrypto } from '../utils/GpwCrypto.js';
import { getPath } from '../utils/getPath.js';
import { nanoid } from 'nanoid';
import fs from 'fs-extra';

/**
 * Save any changes made to the plaintext files to the .gitpw directory after
 *  encrypting them. Unlike the `lock` command, this does not delete plaintext
 *  files afterwards.
 */
export async function saveCommand(session: Session): Promise<void> {
  // Grab files in gitpw repo
  const rootDir = getPath('');
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  if (!entries.some((e) => e.isDirectory() && e.name == '.gitpw')) {
    throw Error('This is not a gitpw repository');
  }

  // Get previous encrypted-decrypted file name/path map
  const oldMaps = await getUnlockedFileMap(session.unlocked_keychain);
  const newMap: GpwFileMap = {};

  // Recursively encrypt directories and build newMap
  async function encryptDir(dirs: string, entries: fs.Dirent[]): Promise<void> {
    for (const entry of entries) {
      // Recursively encrypt subdirectories
      if (entry.isDirectory()) {
        const subdir = `${dirs}/${entry.name}`;
        const subentries = await fs.readdir(subdir, { withFileTypes: true });
        await encryptDir(subdir, subentries);
      }
      // Encrypt file
      else {
        const filepath = `${dirs}/${entry.name}`;
        const relativeFilepath = filepath.replace(rootDir, '');

        // Get ID from oldMap or create new ID
        const id =
          Object.entries(oldMaps.unlocked).find(
            (e) => e[1] == relativeFilepath,
          )?.[0] || nanoid();
        const gpwFilepath = getGpwPath(`files/${id}.json`);

        // Get current potentially-untracked plaintext
        const plaintext = await fs.readFile(filepath, 'utf8');

        // Save relative path in newMap
        // File already exists
        if (oldMaps.locked[id]) {
          newMap[id] = oldMaps.locked[id];

          // Check if the file's content changed
          const originalEncryptedFile: GpwFile = await fs.readJSON(gpwFilepath);
          const originalDecryptedContent = await Promise.all(
            originalEncryptedFile.content.map((c) =>
              GpwCrypto.decrypt(c, session.unlocked_keychain),
            ),
          ).then((c) => c.join(''));
          if (originalDecryptedContent == plaintext) continue;
        }
        // New file
        else {
          newMap[id] = await GpwCrypto.encrypt(
            relativeFilepath,
            session.unlocked_keychain,
          );
        }

        // Encrypt file
        const { birthtime, mtime } = await fs.stat(filepath);
        const encrypted = await GpwCrypto.encrypt(
          plaintext,
          session.unlocked_keychain,
        );
        const file: GpwFile = {
          keychain_id: session.unlocked_keychain.id,
          created_at: new Date(birthtime).toISOString(),
          updated_at: new Date(mtime).toISOString(),
          content: [encrypted],
          id,
        };
        await fs.writeJSON(gpwFilepath, file, { spaces: 2 });
      }
    }
  }

  // Recursively encrypt each file to copy to .gitpw and build newMap
  await encryptDir(
    rootDir,
    entries.filter((e) => !e.name.startsWith('.')),
  );

  // Delete files in oldMap that aren't in newMap
  for (const id of Object.keys(oldMaps.locked)) {
    if (newMap[id]) continue;

    const gpwFilepath = getGpwPath(`files/${id}.json`);
    await fs.remove(gpwFilepath);
  }

  // Write new file map
  await fs.writeJSON(getGpwPath('map.json'), newMap, { spaces: 2 });
}
