import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "../common/types/ComInterface";

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title: string) => ipcRenderer.invoke('set-title', title)
} satisfies ElectronAPI);