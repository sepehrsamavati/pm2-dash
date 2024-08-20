import type { User } from "../../../../common/types/user";

export type IUserRepository = {
    create(user: User): Promise<boolean>;
    count(): Promise<number | null>;
}