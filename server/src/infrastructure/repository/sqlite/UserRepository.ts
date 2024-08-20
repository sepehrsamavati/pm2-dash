import type { ServicesType } from "../../../Services";
import type { User } from "../../../../../common/types/user";
import type { IUserRepository } from "../../../types/contracts/sqliteRepositories";

export default class UserRepository implements IUserRepository {
    private database;

    constructor(container: ServicesType) {
        this.database = container.databaseConnection;
    }

    async create(user: User): Promise<boolean> {
        const transaction = await this.database.instance.transaction();

        const createdUserRef = await this.database.models.user.create({
            ...user,
            isActive: user.isActive ? 1 : 0
        }, { transaction });

        const createdUserId = createdUserRef.get().id;

        if (typeof createdUserId === "number") {
            try {
                const res = await this.database.models.userProcessPermission.bulkCreate(
                    user.processPermissions.map(
                        perm => ({
                            userId: createdUserId,
                            processName: perm.processName,
                            permissions: perm.permissions.join(',')
                        })
                    )
                );
                console.log(res)

                await transaction.commit();
                return true;
            } catch {
                await transaction.rollback();
            }
        } else {
            await transaction.rollback();
        }

        return false;
    }

    async count() {
        try {
            const res = await this.database.models.user.count();
            return res;
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}