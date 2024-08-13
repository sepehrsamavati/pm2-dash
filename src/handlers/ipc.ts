import { ipcMain } from "electron";
import pm2Service from "../services/pm2";
import type { ElectronAPI } from "../../common/types/ComInterface";

let initialized = false;

export const initializeIpcHandlers = () => {
    if (initialized) {
        console.warn("Electron IPC handlers initialization called more than once!");
        return;
    }
    initialized = true;

    ipcMain.handle('pm2:getList', async (event, title): ReturnType<ElectronAPI['pm2']['getList']> => {
        return await pm2Service.list() ?? [];
    });
};
