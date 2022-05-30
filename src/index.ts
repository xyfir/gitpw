import { initializeCommand } from './commands/initializeCommand';
import { unlockCommand } from './commands/unlockCommand';
import { lockCommand } from './commands/lockCommand';
import { saveCommand } from './commands/saveCommand';

type Commands = 'initialize' | 'unlock' | 'lock' | 'init' | 'save';

(async () => {
  try {
    switch (process.argv[2] as Commands) {
      case 'initialize':
      case 'init':
        await initializeCommand();
        break;
      case 'unlock':
        await unlockCommand();
        break;
      case 'lock':
        await lockCommand();
        break;
      case 'save':
        await saveCommand();
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
