import type { Pm2ConnectionType, OperationResultType } from "@/common/types";

export type IPm2Connection = {
    connect(): Promise<OperationResultType>;
    // disconnect(): Promise<OperationResultType>;
    readonly isConnected: boolean;
    readonly name: Pm2ConnectionType;
}