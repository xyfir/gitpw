import type { GpwUnlockedKeychain, GpwRepoManifest } from '.';

/**
 * Authenticated session data
 */
export type Session = GpwRepoManifest & {
  unlocked_keychain: GpwUnlockedKeychain;
};

/**
 * Command that can be run from within the `session` command
 */
export type IntrasessionCommand = 'unlock' | 'lock' | 'save';

/**
 * All command types
 */
export type Command = IntrasessionCommand | 'session' | 'init';
