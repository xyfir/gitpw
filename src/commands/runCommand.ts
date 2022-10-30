import { sessionCommand } from './sessionCommand.js';
import { unlockCommand } from './unlockCommand.js';
import { initCommand } from './initCommand.js';
import { lockCommand } from './lockCommand.js';
import { saveCommand } from './saveCommand.js';
import { moveCommand } from './moveCommand.js';
import { getSession } from '../utils/getSession.js';
import type {
  IntrasessionCommand,
  Session,
  Command,
  Argv,
} from '../types/index.js';

/**
 * @see IntrasessionCommand
 */
export const intrasessionCommands: IntrasessionCommand[] = [
  'unlock',
  'lock',
  'save',
  'move',
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
    case 'move':
      return moveCommand(argv, session!);
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
