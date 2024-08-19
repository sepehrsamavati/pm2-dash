import { Permission } from "./enums";

export type UserProcessPermission = {
    processName: string;
    permissions: Permission[];
}

export type User = {
    username: string;
    password: string;
    isActive: boolean;
    processPermissions: UserProcessPermission[];
}
