import { ipcMain } from "electron";
import ClientSession from "../app/ClientSession";
import type { ElectronAPI, Pm2ConnectionType } from "../../common/types/ComInterface";

let initialized = false;
let clientSession = new ClientSession();

export const initializeIpcHandlers = () => {
    if (initialized) {
        console.warn("Electron IPC handlers initialization called more than once!");
        return;
    }
    initialized = true;

    ipcMain.handle('pm2:initIpc', async (): ReturnType<ElectronAPI['pm2']['initIpc']> => {
        clientSession.connectionType = "LOCAL_IPC";
        return await clientSession.pm2Service.connect();
    });

    // ipcMain.handle('pm2:initHttp', async (_, basePath: string): ReturnType<ElectronAPI['pm2']['initHttp']> => {
    //     clientSession.connectionType = "HTTP_SERVER";
    // });

    ipcMain.handle('pm2:restart', async (_, id: number | string): ReturnType<ElectronAPI['pm2']['restart']> => {
        return await clientSession.pm2Service.restart(id);
    });

    ipcMain.handle('pm2:stop', async (_, id: number | string): ReturnType<ElectronAPI['pm2']['stop']> => {
        return await clientSession.pm2Service.stop(id);
    });

    ipcMain.handle('pm2:flush', async (_, id: number | string): ReturnType<ElectronAPI['pm2']['flush']> => {
        return await clientSession.pm2Service.flush(id);
    });

    ipcMain.handle('pm2:resetCounter', async (_, id: number | string): ReturnType<ElectronAPI['pm2']['resetCounter']> => {
        return await clientSession.pm2Service.reset(id);
    });

    ipcMain.handle('pm2:getList', async (): ReturnType<ElectronAPI['pm2']['getList']> => {
        return await clientSession.pm2Service.list() ?? [];
    });
};
