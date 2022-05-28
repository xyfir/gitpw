import { getPath } from './getPath';
import path from 'path';

/**
 * Get path relative to the .gitpw directory in the current working directory.
 */
export function getGpwPath(filepath: string): string {
  return path.join(getPath('.gitpw'), filepath);
}
