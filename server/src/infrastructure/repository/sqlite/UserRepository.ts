import tables from "./configuration/tables";
import type { ServicesType } from "../../../Services";
import { User } from "../../../../../common/types/user";
import type { IUserRepository } from "../../../types/contracts/sqliteRepositories";
import { commitTransaction, rollbackTransaction, startTransaction } from "./configuration/constants";

export default class UserRepository implements IUserRepository {
    private database;

    constructor(container: ServicesType) {
        this.database = container.databaseConnection.connection;
    }

    async create(user: User): Promise<boolean> {
        this.database.exec(startTransaction);

        const userId = await new Promise<number | null>(resolve => {
            this.database.run(`INSERT INTO ${tables.users} (username, password, isActive) VALUES (?, ?, ?)`,
                [user.username, user.password, user.isActive ? 1 : 0],
                function (err) {
                    if (err)
                        resolve(null);
                    else
                        resolve(this.lastID);
                }
            );
        });

        if (userId !== null) {
            try {
                for (const perm of user.processPermissions) {
                    await new Promise((resolve, reject) => {
                        this.database.run(`INSERT INTO ${tables.userProcessPermissions} (userId, processName, permissions) VALUES (?, ?, ?)`,
                            [userId, perm.processName, perm.permissions.join(',')], err => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(null);
                            });
                    });
                }

                this.database.exec(commitTransaction);
                return true;
            } catch {
                this.database.exec(rollbackTransaction);
            }
        } else {
            this.database.exec(rollbackTransaction);
        }

        return false;
    }
}