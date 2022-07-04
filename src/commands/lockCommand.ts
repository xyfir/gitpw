import { readdir, remove } from 'fs-extra';
import type { Session } from '../types';
import { saveCommand } from './saveCommand';
import { getPath } from '../utils/getPath';

export async function lockCommand(session: Session): Promise<void> {
  await saveCommand(session);

  const entries = await readdir(getPath(''), { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.name.startsWith('.')) {
      await remove(getPath(entry.name));
    }
  }
}
