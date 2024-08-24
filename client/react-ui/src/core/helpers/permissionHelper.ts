import type Session from "../Session";
import { AccountType, Permission } from "../../types/enums";

export default function permissionHelper(options: {
    session: Session;
    operation: Permission;
    processName: string;
}) {
    if (options.session.pm2Connection?.name === "LOCAL_IPC")
        return true;

    if ([
        AccountType.Admin,
        AccountType.Manager
    ].includes(options.session.user?.type as AccountType))
        return true;

    /** Cannot do operation on all */
    if (options.processName === "all")
        return false;

    return options.session.user?.processPermissions.some(p => p.processName === options.processName && p.permissions.includes(options.operation)) ?? false;
}