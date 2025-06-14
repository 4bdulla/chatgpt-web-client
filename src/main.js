const { autoUpdater } = require('electron-updater');

const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  globalShortcut,
  ipcMain,
  shell
} = require('electron');

const path = require('path');
const { default: Store } = require('electron-store');
const AutoLaunch = require('auto-launch');

const store = new Store({
  defaults: {
    alwaysOnTop: false,
    globalShortcut: 'CmdOrCtrl+Shift+G',
    minimizeToTray: true,
    autoLaunch: false,
    windowBounds: { width: 1200, height: 800 }
  }
});

const settings = store.store;

let mainWindow;
let tray;
let isQuitting = false;

const autoLauncher = new AutoLaunch({ name: 'ChatGPT WebClient' });

function createMainWindow() {
  const { width, height } = settings.windowBounds;

  mainWindow = new BrowserWindow({
    width,
    height,
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      partition: 'persist:chatgpt'
    }
  });

  mainWindow.loadURL('https://chat.openai.com');

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const currentURL = mainWindow.webContents.getURL();
    const isSameOrigin = new URL(url).origin === new URL(currentURL).origin;

    if (!isSameOrigin) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.setAlwaysOnTop(settings.alwaysOnTop);

  mainWindow.on('resize', saveWindowBounds);
  mainWindow.on('move', saveWindowBounds);

  mainWindow.on('minimize', (e) => {
    if (settings.minimizeToTray) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('close', (e) => {
    if (!isQuitting && settings.minimizeToTray) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  setupGlobalShortcut();
}

function setupGlobalShortcut() {
  globalShortcut.unregisterAll();

  const shortcut = settings.globalShortcut?.trim();
  const isValid = shortcut && shortcut.includes('+') && shortcut.split('+')[1];

  if (isValid) {
    try {
      globalShortcut.register(shortcut, toggleWindow);
    } catch (e) {
      console.error('Failed to register global shortcut:', shortcut, e);
    }
  } else {
    console.log('Global shortcut disabled.');
  }
}

function toggleWindow() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
  }
}

function saveWindowBounds() {
  if (!mainWindow) return;
  const bounds = mainWindow.getBounds();
  store.set('windowBounds', bounds);
}

function createSettingsWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    parent: mainWindow,
    modal: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  win.loadFile(path.join(__dirname, 'settings.html'));
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, '../assets/icon.png')).resize({ width: 16, height: 16 });
  tray = new Tray(icon);

  const menu = Menu.buildFromTemplate([
    { label: 'Show', click: () => mainWindow.show() },
    { label: 'Settings', click: () => createSettingsWindow() },
    {
      label: 'Always on Top',
      type: 'checkbox',
      checked: settings.alwaysOnTop,
      click: (item) => {
        settings.alwaysOnTop = item.checked;
        store.set('alwaysOnTop', item.checked);
        mainWindow.setAlwaysOnTop(item.checked);
      }
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('ChatGPT Desktop');
  tray.setContextMenu(menu);
  tray.on('double-click', () => mainWindow.show());
}

app.whenReady().then(() => {
  if (settings.autoLaunch) autoLauncher.enable();
  else autoLauncher.disable();

  createMainWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC

ipcMain.handle('get-settings', () => store.store);

ipcMain.on('update-settings', (e, updates) => {
  Object.entries(updates).forEach(([key, value]) => {
    settings[key] = value;
    store.set(key, value);
  });

  mainWindow.setAlwaysOnTop(settings.alwaysOnTop);
  setupGlobalShortcut();

  if (settings.autoLaunch) autoLauncher.enable();
  else autoLauncher.disable();
});
