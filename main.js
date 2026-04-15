const { app, BrowserWindow } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let splashWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html");
}

// 🔥 SPLASH SOLO PARA UPDATE
function createSplash() {
  splashWindow = new BrowserWindow({
    width: 450,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  splashWindow.loadFile("splash.html");
}

// 🔥 MOSTRAR APP NORMAL
function openApp() {
  createMainWindow();
}

// =============================
// APP START
// =============================
app.whenReady().then(() => {
  autoUpdater.checkForUpdates();
});

// =============================
// ❌ NO HAY UPDATE
// =============================
autoUpdater.on("update-not-available", () => {
  openApp();
});

// =============================
// 🔔 HAY UPDATE → MOSTRAR SPLASH
// =============================
autoUpdater.on("update-available", async () => {
  createSplash();
});

// =============================
// USER ACEPTA DESCARGA (desde splash)
// =============================
const { ipcMain } = require("electron");

ipcMain.on("start-update", () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on("skip-update", () => {
  if (splashWindow) splashWindow.close();
  openApp();
});

// =============================
// 📥 PROGRESO
// =============================
autoUpdater.on("download-progress", (progress) => {
  const percent = Math.round(progress.percent);

  if (splashWindow) {
    splashWindow.webContents.send("update-progress", percent);
  }
});

// =============================
// 🔥 UPDATE DESCARGADO → AUTO INSTALL
// =============================
autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});
