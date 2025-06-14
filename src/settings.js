const { ipcRenderer } = require('electron');

window.onload = async () => {
  const settings = await ipcRenderer.invoke('get-settings');

  document.getElementById('alwaysOnTop').checked = settings.alwaysOnTop;
  document.getElementById('minimizeToTray').checked = settings.minimizeToTray;
  document.getElementById('autoLaunch').checked = settings.autoLaunch;

  const presetSelect = document.getElementById('shortcutPreset');
  const current = settings.globalShortcut || 'CmdOrCtrl+Shift+G';

  const found = [...presetSelect.options].some(opt => {
    if (opt.value === current) {
      presetSelect.value = current;
      return true;
    }
    return false;
  });

  if (!found && current) {
    const custom = document.createElement('option');
    custom.value = current;
    custom.textContent = current + ' (custom)';
    presetSelect.appendChild(custom);
    presetSelect.value = current;
  }

  document.querySelectorAll('input[type=checkbox]').forEach(el => {
    el.addEventListener('change', () => {
      const updates = {
        alwaysOnTop: document.getElementById('alwaysOnTop').checked,
        minimizeToTray: document.getElementById('minimizeToTray').checked,
        autoLaunch: document.getElementById('autoLaunch').checked
      };
      ipcRenderer.send('update-settings', updates);
    });
  });

  presetSelect.addEventListener('change', () => {
    const shortcut = presetSelect.value === 'None' ? '' : presetSelect.value;
    ipcRenderer.send('update-settings', { globalShortcut: shortcut });
  });
};
