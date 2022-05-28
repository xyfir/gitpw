import { GpwFileMap, GpwFile } from '../types';
import { writeFile, readJSON } from 'fs-extra';
import { getGpwPath } from '../utils/getGpwPath';
import { getSession } from '../utils/getSession';
import { TrCrypto } from '../utils/TrCrypto';
import { getPath } from '../utils/getPath';
import path from 'path';

export async function unlockCommand(): Promise<void> {
  // Get session
  const session = await getSession();

  // Get encrypted-decrypted file name/path map
  const map: GpwFileMap = await readJSON(path.join(getGpwPath('map.json')));

  // Decrypt contents
  for (const [id, filepath] of Object.entries(map)) {
    // Decrypt map
    map[id] = await TrCrypto.decrypt(filepath, session.unlocked_keychain);

    // Read encrypted file and decrypt its content
    const file: GpwFile = await readJSON(
      path.join(getGpwPath(`files/${id}.json`)),
    );
    const content = await Promise.all(
      file.content.map((c) => TrCrypto.decrypt(c, session.unlocked_keychain)),
    ).then((c) => c.join(''));

    // Write decrypted file
    await writeFile(getPath(map[id]), content);
  }

  return;
}
