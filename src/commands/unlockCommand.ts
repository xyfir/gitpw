import { readJSON, readdir } from 'fs-extra';
import { getGitPwPath } from '../utils/getGitPwPath';
import { getSession } from '../utils/getSession';
import { GpwFileMap } from '../types';
import { TrCrypto } from '../utils/TrCrypto';
import path from 'path';

export async function unlockCommand(): Promise<void> {
  // Get session
  const session = await getSession();

  // Grab encrypted files
  const files = await readdir(getGitPwPath('files/'));

  // Get encrypted-decrypted file name/path map
  const map: GpwFileMap = await readJSON(path.join(getGitPwPath('map.json')));

  // Decrypt map
  for (const [uuid, filepath] of Object.entries(map)) {
    map[uuid] = await TrCrypto.decrypt(filepath, session.unlocked_keychain);
  }

  // Decrypt each file to copy outside of .gitpw

  return;
}
