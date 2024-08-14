import type { Pm2ConnectionType } from "../../../common/types/ComInterface";

export type IPm2Connection = {
    readonly isConnected: boolean;
    readonly name: Pm2ConnectionType;
}