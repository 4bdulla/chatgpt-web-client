# ChatGPT WebClient

A lightweight, cross-platform desktop client for [ChatGPT](https://chat.openai.com), built using [Electron](https://www.electronjs.org/). This app wraps the official ChatGPT web interface and adds desktop features like tray icon, global shortcuts, and session persistence.

---

## 📣 Disclaimer

This app is an **unofficial** wrapper for ChatGPT. It is not affiliated with or endorsed by OpenAI.

---

## ✨ Features

- ✅ Native desktop experience for ChatGPT
- ✅ Tray icon with minimize-to-tray behavior
- ✅ Global shortcut (`Ctrl+Shift+G` or `Cmd+Shift+G`) to toggle visibility
- ✅ Always-on-top mode (via tray menu)
- ✅ Remembers login sessions via persistent Chromium partition
- ✅ Packaged as `.deb`, Flatpak, and more

---

## 📦 Install

### 💻 Linux (.deb)

Download and install:

```bash
sudo dpkg -i chatgpt-webclient_*.deb
````

### 🐧 Flatpak (coming soon)

> Soon to be available on [Flathub](https://flathub.org). For now, you can build it locally (see below).

---

## 🚀 Usage

* Launch from app menu or terminal with:

  ```bash
  chatgpt-webclient
  ```
* Use `Ctrl+Shift+G` (or `Cmd+Shift+G`) to toggle window
* Right-click tray icon for options:

  * Show
  * Toggle "Always on Top"
  * Quit

---

## 🧑‍💻 Development

### Requirements

* Node.js v20+
* Electron 36+
* Linux (for .deb and Flatpak builds)

### Setup

```bash
npm install
npm start
```

### Build `.deb`

```bash
npm run deb
```

### Build Flatpak

```bash
npm run build:flatpak
```

Output is in `dist/`.

---

## 📜 License

MIT License

---

