import { DocHeaders } from '../types';

/**
 * Convert `DocHeaders` to lines of text
 */
export function stringifyDocHeaders(headers: DocHeaders): string[] {
  return [...Object.entries(headers), ...Object.entries(headers.x)]
    .filter(([k]) => k != 'x')
    .map(([k, v]) => `${k} ${Array.isArray(v) ? v.join(' ') : v}`);
}
