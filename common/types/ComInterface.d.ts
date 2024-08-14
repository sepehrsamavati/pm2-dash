import { OperationResultType } from "./OperationResult";
import type { Pm2ProcessDescription } from "./pm2";

export type Pm2ConnectionType = 'LOCAL_IPC' | 'HTTP_SERVER';

export type ElectronAPI = {
    clientReady: () => void;
    closeApp: () => void;
    setPm2ConnectionType: (type: Pm2ConnectionType) => Promise<void>;
    pm2: {
        restart: (pmId: number | string) => Promise<OperationResultType>;
        stop: (pmId: number | string) => Promise<OperationResultType>;
        flush: (pmId: number | string) => Promise<OperationResultType>;
        resetCounter: (pmId: number | string) => Promise<OperationResultType>;
        getList: () => Promise<Pm2ProcessDescription[]>;
    };
}