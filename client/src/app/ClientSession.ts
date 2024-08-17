import PM2Service from "../../../common/services/pm2";
import { OperationResult } from "../../../common/models/OperationResult";
import type { Pm2ConnectionType, TargetProcess } from "../../../common/types/ComInterface";

export default class ClientSession {
    connectionType: Pm2ConnectionType = "LOCAL_IPC";
    pm2Service = new PM2Service();
    pm2HttpServerBasePath = "";

    async initHttpConnection(basePath: string) {
        const result = new OperationResult();

        try {
            const response = await fetch(basePath + "/pm2", {
                headers: {
                    "AccessToken": "not implemented"
                }
            });
            const res = await response.json();
            if (res.ok === true)
                result.succeeded();
        } catch (err) {
            console.error(err);
            result.failed("connectFailed");
        }

        if (result.ok) {
            this.pm2HttpServerBasePath = basePath;
            this.connectionType = "HTTP_SERVER";
        }

        return result;
    }

    async httpServerRequest(path: string, method: string, body?: TargetProcess) {
        const result = new OperationResult();

        const options: RequestInit = {
            method,
            headers: {
                "AccessToken": "not implemented"
            }
        };

        if (body) {
            options.headers = {
                ...options.headers,
                'Content-Type': 'application/json'
            };
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(this.pm2HttpServerBasePath + path, options);

            if (response.status === 200) {
                return await response.json() as OperationResult;
            } else {
                return result.failed("Not 200 response");
            }
        } catch (err) {
            console.error(err);
            return result.failed(err instanceof Error ? ((err.cause as any)?.code ?? "connectFailed") : "connectFailed");
        }
    }

    async dispose() {
        const result = new OperationResult();

        try {
            if (this.connectionType === "LOCAL_IPC") {
                await this.pm2Service.disconnect();
            }
            this.connectionType = "LOCAL_IPC";
            this.pm2HttpServerBasePath = "";
            result.succeeded();
        } catch (err) {
            return result.failed(err instanceof Error ? err.message : JSON.stringify(err));
        }

        return result;
    }
}