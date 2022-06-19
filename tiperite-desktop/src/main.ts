import { BrowserWindow, app } from 'electron';
import * as path from 'path';

function main(): void {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    height: 1080,
    width: 1920,
  });

  // win.loadFile('index.html');
  win.loadURL('http://localhost:19006');

  win.webContents.openDevTools();

  // Bypass CORS
  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } });
    },
  );
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        'Access-Control-Allow-Origin': ['*'],
        ...details.responseHeaders,
      },
    });
  });
}

app.whenReady().then(main).catch(console.error);

app.on('window-all-closed', () => app.quit());
