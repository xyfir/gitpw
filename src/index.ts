import { initializeCommand } from './commands/initializeCommand';
import { unlockCommand } from './commands/unlockCommand';
import { lockCommand } from './commands/lockCommand';

(async () => {
  try {
    switch (process.argv[2] as 'initialize' | 'unlock' | 'lock') {
      case 'initialize':
        await initializeCommand();
        break;
      case 'unlock':
        await unlockCommand();
        break;
      case 'lock':
        await lockCommand();
        break;
      default:
        throw Error('Invalid command');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
