import PM2Service from "../services/pm2";
import type { Pm2ConnectionType } from "../../../common/types/ComInterface";

export default class ClientSession {
    connectionType: Pm2ConnectionType = "LOCAL_IPC";
    pm2Service = new PM2Service();
    pm2HttpServerBasePath = "";
}