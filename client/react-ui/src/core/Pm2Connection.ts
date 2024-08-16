import type { IPm2Connection } from "../types/pm2Connection";
import type { OperationResultType, Pm2ConnectionType } from "@/common/types";

export class Pm2LocalIpcConnection implements IPm2Connection {
    private _isConnected = false;
    get isConnected() {
        return this._isConnected;
    }

    get name(): Pm2ConnectionType {
        return "LOCAL_IPC";
    }

    async connect() {
        const result = await window.electronAPI.pm2.initIpc();

        if (result.ok)
            this._isConnected = true;

        return result;
    }
}

export class Pm2HttpServerConnection implements IPm2Connection {
    private _isConnected = false;
    get isConnected() {
        return this._isConnected;
    }

    get name(): Pm2ConnectionType {
        return "LOCAL_IPC";
    }

    protocol: 'http' | 'https' = 'http';
    hostname = 'localhost';
    port = '80';

    async connect(): Promise<OperationResultType> {
        throw new Error("Method not implemented.");
    }
}
