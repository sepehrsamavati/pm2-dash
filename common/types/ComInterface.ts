import type { ILoginDTO } from "./dto";
import { User, UserViewModel } from "./user";
import type { Pm2ProcessDescription } from "./pm2";
import type { OperationResultType, OperationResultWithDataType } from "./OperationResult";

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
    users: {
        getMe: () => Promise<UserViewModel>;
        getList: () => Promise<OperationResultWithDataType<UserViewModel[]>>;
        create: (user: User) => Promise<OperationResultType>;
    };
    pm2: {
        dispose: () => Promise<OperationResultType>;

        restart: (pmId: number | string) => Promise<OperationResultType>;
        stop: (pmId: number | string) => Promise<OperationResultType>;
        flush: (pmId: number | string) => Promise<OperationResultType>;
        resetCounter: (pmId: number | string) => Promise<OperationResultType>;
        getList: () => Promise<OperationResultWithDataType<Pm2ProcessDescription[]>>;

        getLogFile: (args: { pmId: number | string; type: "out" | "err"; }) => Promise<OperationResultType>;
    };
}