import { ipcMain } from "electron";
import type { ElectronAPI } from "../../common/types/ComInterface";
import pm2Service from "../services/pm2";

ipcMain.handle('pm2:getList', async (event, title): ReturnType<ElectronAPI['pm2']['getList']> => {
    return (await pm2Service.list())?.map(p => ({
        name: p.name ?? "-",
        pId: p.pid ?? -1,
        pmId: p.pm_id ?? -1,
        usage: p.monit && {
            memory: p.monit.memory ?? -1,
            cpu: p.monit.cpu ?? -1
        },
        status: p.pm2_env?.status ?? "-"
    })) ?? [];
});