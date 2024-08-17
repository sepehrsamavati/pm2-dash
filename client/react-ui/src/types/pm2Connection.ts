import type { Pm2ConnectionType } from "@/common/types/ComInterface";
import type { OperationResultType } from "@/common/types/OperationResult";

export type IPm2Connection = {
    connect(): Promise<OperationResultType>;
    disconnect(): Promise<OperationResultType>;
    readonly isConnected: boolean;
    readonly name: Pm2ConnectionType;
}