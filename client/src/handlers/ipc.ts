import fs from "node:fs";
import { Readable } from "node:stream";
import { ipcMain, dialog } from "electron";
import { finished } from "node:stream/promises";
import ClientSession from "../app/ClientSession";
import type { ILoginDTO, IPM2TargetProcess } from "../../../common/types/dto";
import { Pm2ProcessDescription } from "../../../common/types/pm2";
import type { ElectronAPI } from "../../../common/types/ComInterface";
import { OperationResultWithDataType } from "../../../common/types/OperationResult";
import { OperationResult, OperationResultWithData } from "../../../common/models/OperationResult";

let initialized = false;
let clientSession = new ClientSession();

export const initializeIpcHandlers = () => {
    if (initialized) {
        console.warn("Electron IPC handlers initialization called more than once!");
        return;
    }
    initialized = true;

    ipcMain.handle('initIpc', async (): ReturnType<ElectronAPI['initIpc']> => {
        clientSession.connectionType = "LOCAL_IPC";
        return await clientSession.pm2Service.connect();
    });

    ipcMain.handle('initHttp', async (_, targetServer: Parameters<ElectronAPI['initHttp']>[0]): ReturnType<ElectronAPI['initHttp']> => {
        return await clientSession.initHttpConnection(targetServer.basePath);
    });

    ipcMain.handle('login', async (_, dto: ILoginDTO): ReturnType<ElectronAPI['login']> => {
        const result = await clientSession.httpServerRequest("/login", "POST", dto) as unknown as OperationResultWithDataType<string>;
        if (result.ok && result.data) {
            clientSession.pm2HttpServerAccessToken = result.data;
        }
        return result;
    });

    ipcMain.handle('users:getList', async () => {
        return await clientSession.httpServerRequest("/user/list", "GET");
    });

    ipcMain.handle('users:getMe', async () => {
        return await clientSession.httpServerRequest("/user/me", "GET");
    });

    ipcMain.handle('users:create', async (_, user) => {
        return await clientSession.httpServerRequest("/user/create", "PUT", user);
    });

    ipcMain.handle('users:edit', async (_, user) => {
        return await clientSession.httpServerRequest("/user/edit", "PATCH", user);
    });

    ipcMain.handle('users:activate', async (_, id) => {
        return await clientSession.httpServerRequest(`/user/activate/${id}`, "PATCH");
    });

    ipcMain.handle('users:deactivate', async (_, id) => {
        return await clientSession.httpServerRequest(`/user/deactivate/${id}`, "PATCH");
    });

    ipcMain.handle('pm2:dispose', async (): ReturnType<ElectronAPI['pm2']['dispose']> => {
        return await clientSession.dispose();
    });

    ipcMain.handle('pm2:restart', async (_, id: number | string): ReturnType<ElectronAPI['pm2']['restart']> => {
        if (clientSession.connectionType === "HTTP_SERVER") {
            return await clientSession.httpServerRequest("/pm2/restart", "POST", { id });
        } else {
            return await clientSession.pm2Service.restart(id);
        }
    });

    ipcMain.handle('pm2:stop', async (_, id: number | string): ReturnType<ElectronAPI['pm2']['stop']> => {
        if (clientSession.connectionType === "HTTP_SERVER") {
            return await clientSession.httpServerRequest("/pm2/stop", "POST", { pmId: id.toString() } satisfies IPM2TargetProcess);
        } else {
            return await clientSession.pm2Service.stop(id);
        }
    });

    ipcMain.handle('pm2:flush', async (_, id: number | string): ReturnType<ElectronAPI['pm2']['flush']> => {
        if (clientSession.connectionType === "HTTP_SERVER") {
            return await clientSession.httpServerRequest("/pm2/flush", "PATCH", { pmId: id.toString() } satisfies IPM2TargetProcess);
        } else {
            return await clientSession.pm2Service.flush(id);
        }
    });

    ipcMain.handle('pm2:resetCounter', async (_, id: number | string): ReturnType<ElectronAPI['pm2']['resetCounter']> => {
        if (clientSession.connectionType === "HTTP_SERVER") {
            return await clientSession.httpServerRequest("/pm2/reset", "PATCH", { pmId: id.toString() } satisfies IPM2TargetProcess);
        } else {
            return await clientSession.pm2Service.reset(id);
        }
    });

    ipcMain.handle('pm2:getList', async (): ReturnType<ElectronAPI['pm2']['getList']> => {
        if (clientSession.connectionType === "HTTP_SERVER") {
            return await clientSession.httpServerRequest("/pm2/list", "GET") as unknown as OperationResultWithDataType<Pm2ProcessDescription[]>;
        } else {
            const result = new OperationResultWithData<Pm2ProcessDescription[]>().setData([]);
            const list = await clientSession.pm2Service.list();
            if (list)
                result.setData(list).succeeded();
            return result;
        }
    });

    ipcMain.handle('pm2:getLogFile', async (_, args: Parameters<ElectronAPI['pm2']['getLogFile']>[0]): ReturnType<ElectronAPI['pm2']['getLogFile']> => {
        const result = new OperationResult();

        const saveLocation = await dialog.showSaveDialog({
            title: "PM2 application log",
            filters: [
                { name: "All Files", extensions: ["*"] },
                { name: "Text", extensions: ["txt"] }
            ]
        });

        if (!saveLocation.canceled && saveLocation.filePath) {
            if (clientSession.connectionType === "HTTP_SERVER") {
                try {
                    const response = await clientSession.initHttpServerRequest(`/pm2/${args.type === "err" ? "err" : "out"}FilePath?pmId=${args.pmId}`, "GET");

                    const dest = fs.createWriteStream(saveLocation.filePath);
                    if (response.body) {
                        await finished(
                            Readable.fromWeb(response.body as any).pipe(dest)
                        );
                        return result.succeeded();
                    }
                } catch {
                    return result.failed("downloadFailed");
                }

            } else {
                const filePath = await clientSession.pm2Service.getLogPath(args.pmId, args.type);
                if (filePath) {
                    try {
                        await fs.promises.copyFile(filePath, saveLocation.filePath);
                        result.succeeded();
                    } catch { }
                }
            }
        }

        return result;
    });
};
