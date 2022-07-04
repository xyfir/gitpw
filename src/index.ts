import { runCommand, Command } from './utils/runCommand';

(async () => {
  try {
    await runCommand(process.argv[2] as Command);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
