import type { Session } from '../types/index.js';
import { saveCommand } from './saveCommand.js';
import { getPath } from '../utils/getPath.js';
import fs from 'fs-extra';

/**
 * Wipe the plaintext files after encrypting any changes.
 */
export async function lockCommand(session: Session): Promise<void> {
  await saveCommand(session);

  const entries = await fs.readdir(getPath(''), { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.name.startsWith('.')) {
      await fs.remove(getPath(entry.name));
    }
  }
}
