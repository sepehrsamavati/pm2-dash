import config from "../config/config";
import PM2Service from "../../../common/services/pm2";
import { ClientServerInitHello } from "../../../common/types/enums";
import { OperationResult } from "../../../common/models/OperationResult";
import type { Pm2ConnectionType } from "../../../common/types/ComInterface";

export default class ClientSession {
    connectionType: Pm2ConnectionType = "LOCAL_IPC";
    pm2Service = new PM2Service();
    pm2HttpServerBasePath = "";
    pm2HttpServerAccessToken = "";
    pm2HttpServerReplaceHttpStandardMethods = false;
    repeatAfterMeText = crypto.randomUUID();

    async initHttpConnection(basePath: string) {
        const result = new OperationResult();

        this.pm2HttpServerBasePath = basePath;
        this.connectionType = "HTTP_SERVER";
        const res = await this.httpServerRequest("/hello", "GET");

        if (res.ok) {
            result.succeeded();
        } else {
            this.cleanup();
            result.failed(res?.message ?? "connectFailed");
        }

        return result;
    }

    initHttpServerRequest(path: string, method: string, body?: unknown) {
        const headers = new Headers();

        const options: RequestInit = {
            method: method.toUpperCase(),
            headers,
            signal: AbortSignal.timeout(10e3)
        };

        if (this.pm2HttpServerReplaceHttpStandardMethods) {
            if (options.method === "PUT" || options.method === "PATCH")
                options.method = "POST";
        }

        if (this.pm2HttpServerAccessToken)
            headers.append("AccessToken", this.pm2HttpServerAccessToken);

        if (path === "/hello")
            headers.append(ClientServerInitHello.ClientKey, this.repeatAfterMeText);

        if (body) {
            headers.append("Content-Type", "application/json");
            options.body = JSON.stringify(body);
        }

        return fetch(this.pm2HttpServerBasePath + path, options);
    }

    async httpServerRequest(path: string, method: string, body?: unknown) {
        const result = new OperationResult();

        try {
            const response = await this.initHttpServerRequest(path, method, body);

            if (path === "/hello") {
                const repeatedValue = response.headers.get(ClientServerInitHello.ServerKey);
                if (response.status === 200 && repeatedValue === this.repeatAfterMeText) {
                    const res = await response.json();

                    if (typeof res.version === 'number') {
                        if (res.version === config.majorVersion) {

                            if (res.replaceHttpStandardMethods === true)
                                this.pm2HttpServerReplaceHttpStandardMethods = true;

                            return result.succeeded("serverApproved");
                        }
                        else
                            return result.failed("serverVersionDoesNotMatch");
                    }

                    return result.failed("serverDidNotRespondHello");
                }
                return result.failed("serverDidNotRespondHello");
            } else if (response.status === 200) {
                return await response.json() as OperationResult;
            } else if (response.status === 401) {
                return result.failed("invalidToken");
            } else if (response.status === 403) {
                return result.failed("noAccess");
            } else {
                return result.failed("nonOkResponse");
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
        this.pm2HttpServerReplaceHttpStandardMethods = false;
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