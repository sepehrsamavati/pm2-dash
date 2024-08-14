import type { IPm2Connection } from "../types/pm2Connection";
import type { Pm2ConnectionType } from "../../../common/types/ComInterface";

export class Pm2LocalIpcConnection implements IPm2Connection {
    private _isConnected = false;
    get isConnected() {
        return this._isConnected;
    }

    get name(): Pm2ConnectionType {
        return "LOCAL_IPC";
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
}
