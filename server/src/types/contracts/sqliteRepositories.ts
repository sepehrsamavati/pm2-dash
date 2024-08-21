import type { User } from "../../../../common/types/user";
import type { UserDbModel } from "../../infrastructure/repository/sqlite/configuration/entities";

export type IUserRepository = {
    create(user: User): Promise<boolean>;
    count(): Promise<number | null>;
    getAll(): Promise<User[] | null>;
    get(user: Partial<UserDbModel>): Promise<User | null>;
}