const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

test('package.json contains required scripts', async () => {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  assert.ok(pkg.scripts && pkg.scripts.start, 'start script missing');
  assert.ok(pkg.scripts && pkg.scripts.deb, 'deb script missing');
});

test('settings.html has expected elements', async () => {
  const htmlPath = path.join(__dirname, '..', 'src', 'settings.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(/id="alwaysOnTop"/.test(html), 'alwaysOnTop checkbox missing');
  assert.ok(/id="minimizeToTray"/.test(html), 'minimizeToTray checkbox missing');
  assert.ok(/id="autoLaunch"/.test(html), 'autoLaunch checkbox missing');
  assert.ok(/id="shortcutPreset"/.test(html), 'shortcutPreset select missing');
});
