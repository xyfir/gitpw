import { getSession, Session } from './getSession';
import { initializeCommand } from '../commands/initializeCommand';
import { sessionCommand } from '../commands/sessionCommand';
import { unlockCommand } from '../commands/unlockCommand';
import { lockCommand } from '../commands/lockCommand';
import { saveCommand } from '../commands/saveCommand';

/**
 * Command that can be run from within the `session` command.
 */
export type IntrasessionCommand = 'unlock' | 'lock' | 'save';

/**
 * @see IntrasessionCommand
 */
export const intrasessionCommands: IntrasessionCommand[] = [
  'unlock',
  'lock',
  'save',
];

/**
 * All command types
 */
export type Command = IntrasessionCommand | 'initialize' | 'session' | 'init';

/**
 * Run a command
 */
export async function runCommand(
  command: Command,
  session?: Session,
): Promise<void> {
  // Create session for commands that expect it
  if (
    intrasessionCommands.includes(command as IntrasessionCommand) &&
    !session
  ) {
    session = await getSession();
  }

  // Run command
  switch (command) {
    case 'initialize':
    case 'init':
      return initializeCommand();
    case 'session':
      return sessionCommand();
    case 'unlock':
      return unlockCommand(session!);
    case 'lock':
      return lockCommand(session!);
    case 'save':
      return saveCommand(session!);
    default:
      throw Error('Invalid command');
  }
}
