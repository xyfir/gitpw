import { GpwUnlockedKeychain, GpwFileMap } from '../types';
import { getGpwPath } from './getGpwPath';
import { GpwCrypto } from './GpwCrypto';
import { readJSON } from 'fs-extra';

/**
 * Load the file map from the local .gitpw directory and decrypt it
 */
export async function getUnlockedFileMap(
  unlockedKeychain: GpwUnlockedKeychain,
): Promise<GpwFileMap> {
  // Get encrypted-decrypted file name/path map
  const map: GpwFileMap = await readJSON(getGpwPath('map.json'));
  if (!map) return {};

  // Decrypt filepaths
  for (const [id, filepath] of Object.entries(map)) {
    map[id] = await GpwCrypto.decrypt(filepath, unlockedKeychain);
  }

  return map;
}
