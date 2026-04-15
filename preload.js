const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  onUpdateAvailable: (cb) => ipcRenderer.on("update-available", cb),

  onUpdateSkipped: (cb) => ipcRenderer.on("update-skipped", cb),
});
