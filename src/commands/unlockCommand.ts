import { GpwFileMap, GpwFile } from '../types';
import { writeFile, readJSON } from 'fs-extra';
import { getUnlockedFileMap } from '../utils/getUnlockedFileMap';
import { getGpwPath } from '../utils/getGpwPath';
import { getSession } from '../utils/getSession';
import { GpwCrypto } from '../utils/GpwCrypto';
import { getPath } from '../utils/getPath';
import { utimes } from 'utimes';

export async function unlockCommand(): Promise<void> {
  // Get session
  const session = await getSession();

  // Get encrypted-decrypted file name/path map
  const map: GpwFileMap = await getUnlockedFileMap(session.unlocked_keychain);

  // Decrypt contents
  for (const id of Object.keys(map)) {
    // Read encrypted file and decrypt its content
    const file: GpwFile = await readJSON(getGpwPath(`files/${id}.json`));
    const content = await Promise.all(
      file.content.map((c) => GpwCrypto.decrypt(c, session.unlocked_keychain)),
    ).then((c) => c.join(''));

    // Write decrypted file
    await writeFile(getPath(map[id]), content);
    await utimes(getPath(map[id]), {
      btime: new Date(file.created_at).getTime(),
      mtime: new Date(file.updated_at).getTime(),
    });
  }
}
