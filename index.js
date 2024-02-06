const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1160,
    height: 710,
    resizable: false,
    maximizable: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.setIcon(path.join(__dirname, '/assets/logo.png'));
  win.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.on('close', (event, ...args) => {
    win.close();
  });

  ipcMain.on('minimize', (event, ...args) => {
    win.minimize();
  });

  ipcMain.on('login', (event, ...args) => {
    require('electron').shell.openExternal("http://easy.kotelek.dev/dash/callback/store");
  });

  ipcMain.on('update', (event, ...args) => {
    console.log('es');
  });

  const commandLineArg = process.argv[1];

  if (commandLineArg && commandLineArg.startsWith('easystore:/auth/')) {
    const urlObj = new URL(commandLineArg, 'http://example.com');

    const name = urlObj.searchParams.get('name');
    const avatar = urlObj.searchParams.get('avatar');

    win.webContents.executeJavaScript(`
      localStorage.setItem('userData', JSON.stringify({ "name": "${name}", "avatar": "${avatar}" }));
      localStorage.setItem('isLogged', true);
    `);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
