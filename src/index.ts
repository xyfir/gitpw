import type { GpwKeyType, Argv } from './types';
import { runCommand } from './commands/runCommand';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';

yargs(hideBin(process.argv))
  .option('password', {
    description: 'Password(s) to encrypt/decrypt with, in order',
    global: true,
    alias: 'p',
    array: true,
  })
  .command(
    'init',
    'Initialize a gitpw and git repository',
    (yargs) =>
      yargs
        .option('encryption', {
          description: 'Encryption method(s) to use, in order of passwords',
          choices: ['XChaCha20-Poly1305', 'AES-256-GCM'] as GpwKeyType[],
          alias: 'e',
          array: true,
        })
        .option('vscode', {
          description: 'Initialize a VSCode workspace',
          boolean: true,
          default: false,
        }),
    (argv) => runCommand('init', undefined, argv as Argv<'init'>),
  )
  .command(
    'save',
    'Encrypt and track plaintext changes to the gitpw repo',
    () => undefined,
    (argv) => runCommand('save', undefined, argv as Argv<'save'>),
  )
  .command(
    'lock',
    'The same as the "save" command, but it wipes plaintext files after',
    () => undefined,
    (argv) => runCommand('lock', undefined, argv as Argv<'lock'>),
  )
  .command(
    'session',
    'Start an authenticated session to easily run multiple commands',
    () => undefined,
    (argv) => runCommand('session', undefined, argv as Argv<'session'>),
  )
  .command(
    'unlock',
    'Decrypt gitpw repo, overwriting existing plaintext files',
    () => undefined,
    (argv) => runCommand('unlock', undefined, argv as Argv<'unlock'>),
  )
  .demandCommand(1)
  .global('password')
  .help()
  .parse();
