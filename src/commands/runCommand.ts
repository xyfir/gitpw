import type { IntrasessionCommand, Session, Command, Argv } from '../types';
import { sessionCommand } from './sessionCommand';
import { unlockCommand } from './unlockCommand';
import { initCommand } from './initCommand';
import { lockCommand } from './lockCommand';
import { saveCommand } from './saveCommand';
import { getSession } from '../utils/getSession';

/**
 * @see IntrasessionCommand
 */
export const intrasessionCommands: IntrasessionCommand[] = [
  'unlock',
  'lock',
  'save',
];

/**
 * Run a command function from a name string. Prepare session when necessary.
 */
export async function runCommand(
  command: Command,
  session?: Session,
  argv?: Argv,
): Promise<void> {
  // Create session for commands that expect it
  if (
    intrasessionCommands.includes(command as IntrasessionCommand) &&
    !session
  ) {
    session = await getSession(argv);
  }

  // Run command
  switch (command) {
    case 'session':
      return sessionCommand(argv);
    case 'unlock':
      return unlockCommand(session!);
    case 'init':
      return initCommand(argv);
    case 'lock':
      return lockCommand(session!);
    case 'save':
      return saveCommand(session!);
    default:
      throw Error('Invalid command');
  }
}
