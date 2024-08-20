import { Permission, AccountType } from "./enums";

export type UserProcessPermission = {
    processName: string;
    permissions: Permission[];
}

export type User = {
    username: string;
    password: string;
    type: AccountType;
    isActive: boolean;
    processPermissions: UserProcessPermission[];
}

export type UserViewModel = Omit<User, 'password'>;
