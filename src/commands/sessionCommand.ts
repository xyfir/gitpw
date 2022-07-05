import type { Command } from '../types';
import { getSession } from '../utils/getSession';
import { runCommand } from './runCommand';
import inquirer from 'inquirer';

/**
 * Create an authenticated interactive session that allows the user to easily
 *  run multiple commands back-to-back.
 */
export async function sessionCommand(): Promise<never> {
  const commands: Command[] = ['save', 'lock', 'unlock'];

  // Authenticate and prepare session
  const session = await getSession();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Prompt user for the command to run
    const { command } = await inquirer.prompt<{ command: Command }>({
      message: 'command',
      choices: commands,
      name: 'command',
      type: 'list',
    });

    // Run command
    await runCommand(command, session);
  }
}
