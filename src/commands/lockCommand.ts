import { GpwFileMap, GpwFile } from '../types';
import { getUnlockedFileMap } from '../utils/getUnlockedFileMap';
import { getGpwPath } from '../utils/getGpwPath';
import { getSession } from '../utils/getSession';
import { GpwCrypto } from '../utils/GpwCrypto';
import { getPath } from '../utils/getPath';
import { nanoid } from 'nanoid';
import {
  writeJSON,
  readFile,
  readJSON,
  readdir,
  Dirent,
  remove,
} from 'fs-extra';

export async function lockCommand(): Promise<void> {
  // Get session
  const session = await getSession();
  const now = new Date().toISOString();

  // Grab files in gitpw repo
  const rootDir = getPath('');
  const entries = await readdir(rootDir, { withFileTypes: true });
  if (!entries.some((e) => e.isDirectory() && e.name == '.gitpw')) {
    throw Error('This is not a gitpw repository');
  }

  // Get previous encrypted-decrypted file name/path map
  const oldMap = await getUnlockedFileMap(session.unlocked_keychain);
  const newMap: GpwFileMap = {};

  // Recursively encrypt directories and build newMap
  async function encryptDir(dirs: string, entries: Dirent[]): Promise<void> {
    for (const entry of entries) {
      // Recursively encrypt subdirectories
      if (entry.isDirectory()) {
        const subdir = `${dirs}/${entry.name}`;
        const subentries = await readdir(subdir, { withFileTypes: true });
        await encryptDir(subdir, subentries);
      }
      // Encrypt file
      else {
        const filepath = `${dirs}/${entry.name}`;

        // Get ID from oldMap or create new ID
        const id =
          Object.entries(oldMap).find((e) => e[1] == filepath)?.[0] || nanoid();
        const gpwFilepath = getGpwPath(`files/${id}.json`);

        const oldFile: GpwFile = oldMap[id]
          ? await readJSON(gpwFilepath, 'utf8')
          : undefined;

        // Encrypt file
        const plaintext = await readFile(filepath, 'utf8');
        const encrypted = await GpwCrypto.encrypt(
          plaintext,
          session.unlocked_keychain,
        );
        const file: GpwFile = {
          created_at: oldFile?.created_at || now,
          updated_at: now,
          content: [encrypted],
          id,
        };
        await writeJSON(gpwFilepath, file);

        // Save relative path in newMap
        if (oldMap[id]) {
          newMap[id] = oldMap[id];
        } else {
          newMap[id] = await GpwCrypto.encrypt(
            filepath.replace(rootDir, ''),
            session.unlocked_keychain,
          );
        }
      }
    }
  }

  // Recursively encrypt each file to copy to .gitpw and build newMap
  await encryptDir(
    rootDir,
    entries.filter((e) => e.name != '.gitpw'),
  );

  // Delete files in oldMap that aren't in newMap
  for (const id of Object.keys(oldMap)) {
    if (newMap[id]) continue;

    const gpwFilepath = getGpwPath(`files/${id}.json`);
    await remove(gpwFilepath);
  }

  // Write new file map
  await writeJSON(getGpwPath('map.json'), newMap);
}
