(async () => {
  try {
    const command = process.argv[2] as 'unlock' | 'lock';

    switch (command) {
      case 'unlock': {
        break;
      }
      case 'lock': {
        break;
      }
      default:
        throw Error('Invalid command');
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
