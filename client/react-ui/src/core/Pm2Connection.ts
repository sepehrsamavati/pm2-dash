import type { IPm2Connection } from "../types/pm2Connection";
import type { Pm2ProcessDescription } from "@/common/types/pm2";
import type { Pm2ConnectionType } from "@/common/types/ComInterface";
import type { OperationResultType } from "@/common/types/OperationResult";

abstract class Pm2ConnectionBase implements Partial<IPm2Connection> {
    public cachedList: Pm2ProcessDescription[] = [];
}

export class Pm2LocalIpcConnection extends Pm2ConnectionBase implements IPm2Connection {
    private _isConnected = false;
    get isConnected() {
        return this._isConnected;
    }

    get name(): Pm2ConnectionType {
        return "LOCAL_IPC";
    }

    async connect() {
        const result = await window.electronAPI.initIpc();

        if (result.ok)
            this._isConnected = true;

        return result;
    }

    async disconnect() {
        const res = await window.electronAPI.pm2.dispose();

        if (res.ok)
            this._isConnected = false;

        return res;
    }
}

export class Pm2HttpServerConnection extends Pm2ConnectionBase implements IPm2Connection {
    private _isConnected = false;
    get isConnected() {
        return this._isConnected;
    }

    get name(): Pm2ConnectionType {
        return "HTTP_SERVER";
    }

    protocol: 'http' | 'https' = 'http';
    hostname = 'localhost';
    port = '80';
    accessToken = "";

    async connect(): Promise<OperationResultType> {
        const result = await window.electronAPI.initHttp({
            basePath: `${this.protocol}://${this.hostname}:${this.port}`
        });

        if (result.ok)
            this._isConnected = true;

        return result;
    }

    async disconnect() {
        const res = await window.electronAPI.pm2.dispose();

        if (res.ok)
            this._isConnected = false;

        return res;
    }
}
