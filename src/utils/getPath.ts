import path from 'path';

/**
 * Get path relative to the current working directory.
 */
export function getPath(filepath: string): string {
  return path.join(process.cwd(), filepath);
}
