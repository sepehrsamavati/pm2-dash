import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "../../common/types/ComInterface";

contextBridge.exposeInMainWorld('electronAPI', {
    clientReady: () => ipcRenderer.send('showMainFrame'),
    closeApp: () => ipcRenderer.send('closeApp'),
    pm2: {
        initIpc: () => ipcRenderer.invoke('pm2:initIpc'),
        initHttp: (targetServer) => ipcRenderer.invoke('pm2:initHttp', targetServer),
        dispose: () => ipcRenderer.invoke('pm2:dispose'),
        restart: (pmId: number | string) => ipcRenderer.invoke('pm2:restart', pmId),
        stop: (pmId: number | string) => ipcRenderer.invoke('pm2:stop', pmId),
        flush: (pmId: number | string) => ipcRenderer.invoke('pm2:flush', pmId),
        resetCounter: (pmId: number | string) => ipcRenderer.invoke('pm2:resetCounter', pmId),
        getList: () => ipcRenderer.invoke('pm2:getList'),
        getLogFile: (pmId: number | string) => ipcRenderer.invoke('pm2:getLogFile', pmId),
    }
} satisfies ElectronAPI);