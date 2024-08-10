import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "../common/types/ComInterface";

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title: string) => ipcRenderer.send('set-title', title)
} satisfies ElectronAPI);