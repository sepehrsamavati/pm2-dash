import { ipcMain } from "electron";
import type { ElectronAPI } from "../../common/types/ComInterface";

ipcMain.handle('set-title', async (event, title): ReturnType<ElectronAPI['setTitle']> => {
    console.log(title);
    return Math.random();
});