import { BrowserWindow, app } from 'electron';
import * as path from 'path';

function main(): void {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    height: 600,
    width: 800,
  });

  win.loadFile('index.html');
}

app.whenReady().then(main).catch(console.error);

app.on('window-all-closed', () => app.quit());
