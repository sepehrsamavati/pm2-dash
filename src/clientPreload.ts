import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title: unknown) => ipcRenderer.send('set-title', title)
});