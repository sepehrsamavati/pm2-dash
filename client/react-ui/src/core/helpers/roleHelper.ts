import Session from "../Session";
import { AccountType } from "../../types/enums";

export default function hasAccess(options: {
    page?: AccountType | AccountType[];
    session?: Session;
    /** Access to users with roles 'Owner' or 'Admin' are granted by default; This option disables this behavior. */
    disableAuto?: boolean;
}) {
    if (options.session?.pm2Connection?.name === "LOCAL_IPC")
        return true; // no limit in local mode

    const user = options.session?.user;
    const accessRoles = options.page ? (Array.isArray(options.page) ? options.page : [options.page]) : null;
    const userRoles = user ? [user.type] : null;
    return accessRoles && userRoles ? (options.disableAuto !== true && userRoles.includes(AccountType.Admin)) || accessRoles.some(r => userRoles.includes(r)) : false;
}