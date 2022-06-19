import { readdir, remove } from 'fs-extra';
import { saveCommand } from './saveCommand';
import { getPath } from '../utils/getPath';

export async function lockCommand(): Promise<void> {
  await saveCommand();

  const entries = await readdir(getPath(''), { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.name.startsWith('.')) {
      await remove(getPath(entry.name));
    }
  }
}
