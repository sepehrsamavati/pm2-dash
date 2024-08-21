import { AccountType } from "../../types/enums";

export default function hasAccess(options: {
    page?: AccountType | AccountType[];
    user?: AccountType | AccountType[];
    /** Access to users with roles 'Owner' or 'Admin' are granted by default; This option disables this behavior. */
    disableAuto?: boolean;
}) {
    const accessRoles = options.page ? (Array.isArray(options.page) ? options.page : [options.page]) : null;
    const userRoles = options.user ? (Array.isArray(options.user) ? options.user : [options.user]) : null;
    return accessRoles && userRoles ? (options.disableAuto !== true && userRoles.includes(AccountType.Admin)) || accessRoles.some(r => userRoles.includes(r)) : false;
}