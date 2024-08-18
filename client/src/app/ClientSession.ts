import PM2Service from "../../../common/services/pm2";
import { OperationResult } from "../../../common/models/OperationResult";
import type { Pm2ConnectionType, TargetProcess } from "../../../common/types/ComInterface";

export default class ClientSession {
    connectionType: Pm2ConnectionType = "LOCAL_IPC";
    pm2Service = new PM2Service();
    pm2HttpServerBasePath = "";
    pm2HttpServerAccessToken = "";

    async initHttpConnection(basePath: string, accessToken: string) {
        const result = new OperationResult();


        this.pm2HttpServerBasePath = basePath;
        this.pm2HttpServerAccessToken = accessToken;
        this.connectionType = "HTTP_SERVER";
        const res = await this.httpServerRequest("/pm2", "GET");


        if (res.ok) {
            result.succeeded();
        } else {
            this.cleanup();
            result.failed(res?.message ?? "connectFailed");
        }

        return result;
    }

    async httpServerRequest(path: string, method: string, body?: TargetProcess) {
        const result = new OperationResult();

        const options: RequestInit = {
            method,
            headers: {
                "AccessToken": this.pm2HttpServerAccessToken
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
            } else if (response.status === 401) {
                return result.failed("invalidToken");
            } else {
                return result.failed("Not 200 response");
            }
        } catch (err) {
            console.error(err);
            return result.failed(err instanceof Error ? ((err.cause as any)?.code ?? "connectFailed") : "connectFailed");
        }
    }

    private cleanup() {
        this.connectionType = "LOCAL_IPC";
        this.pm2HttpServerBasePath = "";
        this.pm2HttpServerAccessToken = "";
    }

    async dispose() {
        const result = new OperationResult();

        try {
            if (this.connectionType === "LOCAL_IPC") {
                await this.pm2Service.disconnect();
            }

            this.cleanup();

            result.succeeded();
        } catch (err) {
            return result.failed(err instanceof Error ? err.message : JSON.stringify(err));
        }

        return result;
    }
}