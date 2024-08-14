import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "../common/types/ComInterface";

contextBridge.exposeInMainWorld('electronAPI', {
    clientReady: () => ipcRenderer.send('showMainFrame'),
    setPm2ConnectionType: (type) => ipcRenderer.invoke('setPm2ConnectionType', type),
    pm2: {
        restart: (pmId: number) => ipcRenderer.invoke('pm2:restart', pmId),
        stop: (pmId: number) => ipcRenderer.invoke('pm2:stop', pmId),
        flush: (pmId: number) => ipcRenderer.invoke('pm2:flush', pmId),
        restartAll: (pmId: number) => ipcRenderer.invoke('pm2:restartAll', pmId),
        flushAll: (pmId: number) => ipcRenderer.invoke('pm2:flushAll', pmId),
        getList: () => ipcRenderer.invoke('pm2:getList'),
    }
} satisfies ElectronAPI);