import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "../common/types/ComInterface";

contextBridge.exposeInMainWorld('electronAPI', {
    clientReady: () => ipcRenderer.send('showMainFrame'),
    pm2: {
        getList: () => ipcRenderer.invoke('pm2:getList')
    }
} satisfies ElectronAPI);