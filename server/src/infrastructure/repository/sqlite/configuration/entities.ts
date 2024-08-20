import type { User, UserProcessPermission } from "../../../../../../common/types/user";

type WithIncrementalId<T> = T & {
    id: number;
};

export type CreateModel<T> = Omit<T, 'id'>;

export type UserDbModel = WithIncrementalId<Omit<User, 'isActive' | 'processPermissions'> & {
    isActive: number;
}>;

export type UserProcessPermissionDbModel = Omit<UserProcessPermission, 'permissions'> & {
    userId: UserDbModel['id'];
    permissions: string;
};

export type UserIncludedDbModel = UserDbModel & {
    processPermissions: UserProcessPermissionDbModel[];
};
