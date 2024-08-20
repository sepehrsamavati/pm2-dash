import type { ILoginDTO } from "./dto";
import type { Pm2ProcessDescription } from "./pm2";
import type { OperationResultType } from "./OperationResult";

export type Pm2ConnectionType = 'LOCAL_IPC' | 'HTTP_SERVER';

export type TargetProcess = {
    id: number | string
};

export type ElectronAPI = {
    clientReady: () => void;
    closeApp: () => void;
    initIpc: () => Promise<OperationResultType>;
    initHttp: (args: { basePath: string; }) => Promise<OperationResultType>;
    login: (dto: ILoginDTO) => Promise<OperationResultType>;
    pm2: {
        dispose: () => Promise<OperationResultType>;

        restart: (pmId: number | string) => Promise<OperationResultType>;
        stop: (pmId: number | string) => Promise<OperationResultType>;
        flush: (pmId: number | string) => Promise<OperationResultType>;
        resetCounter: (pmId: number | string) => Promise<OperationResultType>;
        getList: () => Promise<Pm2ProcessDescription[]>;

        getLogFile: (args: { pmId: number | string; type: "out" | "err"; }) => Promise<OperationResultType>;
    };
}