import { OperationResultType } from "./OperationResult";
import type { Pm2ProcessDescription } from "./pm2";

export type Pm2ConnectionType = 'LOCAL_IPC' | 'HTTP_SERVER';

export type ElectronAPI = {
    clientReady: () => void;
    setPm2ConnectionType: (type: Pm2ConnectionType) => Promise<void>;
    pm2: {
        restart: (pmId: number) => Promise<OperationResultType>;
        stop: (pmId: number) => Promise<OperationResultType>;
        flush: (pmId: number) => Promise<OperationResultType>;
        restartAll: (pmId: number) => Promise<OperationResultType>;
        flushAll: (pmId: number) => Promise<OperationResultType>;
        getList: () => Promise<Pm2ProcessDescription[]>;
    };
}