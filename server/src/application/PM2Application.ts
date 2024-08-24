import fs from "node:fs/promises";
import type { ServicesType } from "../Services";
import { AccountType, Permission } from "../../../common/types/enums";
import type { Pm2ProcessDescription } from "../../../common/types/pm2";
import type { Pm2ProcessOperation } from "../types/contracts/pm2Operation";
import { OperationResult, OperationResultWithData } from "../../../common/models/OperationResult";

export default class PM2Application {
    private readonly pm2Service;

    constructor(container: ServicesType) {
        this.pm2Service = container.pm2Daemon;

        this.pm2Service.connect();
    }

    private hasPermission(permission: Permission, opt: Pm2ProcessOperation) {
        if ([
            AccountType.Admin,
            AccountType.Manager
        ].includes(opt.user.type))
            return true;

        /** Cannot do operation on all */
        if (opt.pmId === "all")
            return false;

        return opt.user.processPermissions.some(p => p.processName === opt.pmId && p.permissions.includes(permission));
    }

    async getList(user: Pm2ProcessOperation['user']) {
        const result = new OperationResultWithData<Pm2ProcessDescription[]>();

        const list = await this.pm2Service.list();

        if (!list)
            return result.failed("getListFailed");

        result.setData(
            list.filter(app => this.hasPermission(Permission.ViewProcess, { pmId: app.name, user }))
        ).succeeded();

        return result;
    }

    async restart(opt: Pm2ProcessOperation) {
        const result = new OperationResult();

        if (this.hasPermission(Permission.RestartProcess, opt))
            return await this.pm2Service.restart(opt.pmId);

        return result.failed("noAccess");
    }

    async stop(opt: Pm2ProcessOperation) {
        const result = new OperationResult();

        if (this.hasPermission(Permission.StopProcess, opt))
            return await this.pm2Service.stop(opt.pmId);

        return result.failed("noAccess");
    }

    async delete(opt: Pm2ProcessOperation) {
        const result = new OperationResult();

        if (this.hasPermission(Permission.DeleteProcess, opt))
            return await this.pm2Service.delete(opt.pmId);

        return result.failed("noAccess");
    }

    async flush(opt: Pm2ProcessOperation) {
        const result = new OperationResult();

        if (this.hasPermission(Permission.FlushProcess, opt)) {
            if (opt.pmId === "all")
                opt.pmId = ""; //should be empty to flush all
            return await this.pm2Service.flush(opt.pmId);
        }

        return result.failed("noAccess");
    }

    async reset(opt: Pm2ProcessOperation) {
        const result = new OperationResult();

        if (this.hasPermission(Permission.ResetProcess, opt))
            return await this.pm2Service.reset(opt.pmId);

        return result.failed("noAccess");
    }

    async readOutputLogFile(opt: Pm2ProcessOperation) {
        const result = new OperationResultWithData<Buffer>();

        if (!this.hasPermission(Permission.GetOutputLog, opt))
            return result.failed("noAccess");

        const path = await this.pm2Service.getLogPath(opt.pmId, "out");
        if (!path)
            return result.failed("couldNotGetFilePath");

        try {
            const data = await fs.readFile(path);
            result.setData(data).succeeded();
        } catch (err) {
            console.error(err);
            result.failed("couldNotReaFileData");
        }

        return result;
    }

    async readErrorLogFile(opt: Pm2ProcessOperation) {
        const result = new OperationResultWithData<Buffer>();

        if (!this.hasPermission(Permission.GetErrorLog, opt))
            return result.failed("noAccess");

        const path = await this.pm2Service.getLogPath(opt.pmId, "err");
        if (!path)
            return result.failed("couldNotGetFilePath");

        try {
            const data = await fs.readFile(path);
            result.setData(data).succeeded();
        } catch (err) {
            console.error(err);
            result.failed("couldNotReaFileData");
        }

        return result;
    }
}