import { contextBridge, ipcRenderer } from "electron";
import type { ElectronAPI } from "../../common/types/ComInterface";

contextBridge.exposeInMainWorld('electronAPI', {
    clientReady: () => ipcRenderer.send('showMainFrame'),
    closeApp: () => ipcRenderer.send('closeApp'),
    initIpc: () => ipcRenderer.invoke('initIpc'),
    initHttp: (targetServer) => ipcRenderer.invoke('initHttp', targetServer),
    login: (dto) => ipcRenderer.invoke('login', dto),
    users: {
        getList: () => ipcRenderer.invoke('users:getList'),
        create: (user) => ipcRenderer.invoke('users:create', user),
        edit: (user) => ipcRenderer.invoke('users:edit', user),
        getMe: () => ipcRenderer.invoke('users:getMe'),
        activate: (id) => ipcRenderer.invoke('users:activate', id),
        deactivate: (id) => ipcRenderer.invoke('users:deactivate', id),
    },
    pm2: {
        dispose: () => ipcRenderer.invoke('pm2:dispose'),
        restart: (pmId: number | string) => ipcRenderer.invoke('pm2:restart', pmId),
        stop: (pmId: number | string) => ipcRenderer.invoke('pm2:stop', pmId),
        flush: (pmId: number | string) => ipcRenderer.invoke('pm2:flush', pmId),
        resetCounter: (pmId: number | string) => ipcRenderer.invoke('pm2:resetCounter', pmId),
        getList: () => ipcRenderer.invoke('pm2:getList'),
        getLogFile: (args) => ipcRenderer.invoke('pm2:getLogFile', args),
    }
} satisfies ElectronAPI);