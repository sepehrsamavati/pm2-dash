import type { User, UserWithId } from "../../../../common/types/user";
import type { UserDbModel } from "../../infrastructure/repository/sqlite/configuration/entities";

export type IUserRepository = {
    create(user: User): Promise<boolean>;
    count(): Promise<number | null>;
    getAll(): Promise<UserWithId[] | null>;
    get(user: Partial<UserDbModel>): Promise<UserWithId | null>;
}