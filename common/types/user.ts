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

export type UserWithId = User & {
    id: number;
}

export type UserViewModel = Omit<User, 'password'>;

export type UserInfoViewModel = Omit<UserWithId, 'password'>;
