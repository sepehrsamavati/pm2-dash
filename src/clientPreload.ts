import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "../common/types/ComInterface";

contextBridge.exposeInMainWorld('electronAPI', {
    clientReady: () => ipcRenderer.send('showMainFrame'),
    closeApp: () => ipcRenderer.send('closeApp'),
    setPm2ConnectionType: (type) => ipcRenderer.invoke('setPm2ConnectionType', type),
    pm2: {
        restart: (pmId: number | string) => ipcRenderer.invoke('pm2:restart', pmId),
        stop: (pmId: number | string) => ipcRenderer.invoke('pm2:stop', pmId),
        flush: (pmId: number | string) => ipcRenderer.invoke('pm2:flush', pmId),
        resetCounter: (pmId: number | string) => ipcRenderer.invoke('pm2:resetCounter', pmId),
        getList: () => ipcRenderer.invoke('pm2:getList'),
    }
} satisfies ElectronAPI);