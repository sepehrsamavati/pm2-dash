import { Pm2ProcessDescription } from "@/common/types/pm2";
import type { Pm2ConnectionType } from "@/common/types/ComInterface";
import type { OperationResultType } from "@/common/types/OperationResult";

export type IPm2Connection = {
    connect(): Promise<OperationResultType>;
    disconnect(): Promise<OperationResultType>;
    cachedList: Pm2ProcessDescription[];
    readonly isConnected: boolean;
    readonly name: Pm2ConnectionType;
}