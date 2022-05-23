import path from 'path';

export function getGitPwPath(filepath: string): string {
  return path.join(process.cwd(), '.gitpw', filepath);
}
