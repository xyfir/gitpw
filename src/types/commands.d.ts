import type { GpwUnlockedKeychain, GpwRepoManifest, GpwKeyType } from '.';

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

/**
 * A command->argv map. Everything is optional.
 */
export type CommandsArgv = {
  // [command]: argv
  session?: { password?: string[] };
  unlock?: { password?: string[] };
  init?: {
    encryption?: GpwKeyType[];
    password?: string[];
    vscode?: boolean;
  };
  save?: { password?: string[] };
  lock?: { password?: string[] };
};

/**
 * argv for a specific command name
 *
 * @example Argv
 * @example Argv<'save'>
 */
export type Argv<K extends keyof CommandsArgv = keyof CommandsArgv> =
  CommandsArgv[K];
