import { WhereOptions } from "sequelize";
import type { ServicesType } from "../../../Services";
import type { User, UserWithId } from "../../../../../common/types/user";
import type { UserDbModel, UserIncludedDbModel } from "./configuration/entities";
import type { IUserRepository } from "../../../types/contracts/sqliteRepositories";

export default class UserRepository implements IUserRepository {
    private database;

    constructor(container: ServicesType) {
        this.database = container.databaseConnection;
    }

    async create(user: User): Promise<boolean> {
        const transaction = await this.database.instance.transaction();

        const createdUserRef = await this.database.models.user.create(user, { transaction });

        const createdUserId = createdUserRef.get().id;

        if (typeof createdUserId === "number") {
            try {
                await this.database.models.userProcessPermission.bulkCreate(
                    user.processPermissions.map(
                        perm => ({
                            userId: createdUserId,
                            processName: perm.processName,
                            permissions: perm.permissions.join(',')
                        })
                    ),
                    { transaction }
                );

                await transaction.commit();
                return true;
            } catch (err) {
                console.log(err)
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

    async get(user: Partial<UserDbModel>): Promise<UserWithId | null> {
        try {
            const _where: WhereOptions<UserDbModel> = {
                isActive: true
            };

            if (user.id)
                _where.id = user.id;

            if (user.username)
                _where.username = user.username;

            const res = await this.database.models.user.findOne({
                plain: true,
                where: _where,
                include: {
                    all: true,
                }
            }) as unknown as UserIncludedDbModel;

            return res ? {
                id: res.id,
                username: res.username,
                password: res.password,
                type: res.type,
                isActive: res.isActive,
                processPermissions: res.processPermissions.map(item => ({ processName: item.processName, permissions: item.permissions.split(',').map(x => Number.parseInt(x)) }))
            } satisfies UserWithId : null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async getAll(): Promise<UserWithId[] | null> {
        try {
            const res = await this.database.models.user.findAll({
                include: {
                    all: true,
                }
            });

            return res.map(u => ({
                id: u.dataValues.id,
                username: u.dataValues.username,
                password: u.dataValues.password,
                type: u.dataValues.type,
                isActive: u.dataValues.isActive,
                processPermissions: (u.dataValues as unknown as UserIncludedDbModel)
                    .processPermissions
                    .map(item => ({ processName: item.processName, permissions: item.permissions.split(',').map(x => Number.parseInt(x)) }))
            } satisfies UserWithId)) ?? null;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async update(id: number, user: Partial<User>): Promise<boolean> {
        try {
            const transaction = await this.database.instance.transaction();

            try {
                await this.database.models.user.update(user, {
                    transaction,
                    returning: [],
                    where: {
                        id
                    },
                });

                if (user.processPermissions) {
                    await this.database.models.userProcessPermission.destroy({
                        transaction,
                        where: {
                            userId: id
                        }
                    });

                    await this.database.models.userProcessPermission.bulkCreate(
                        user.processPermissions.map(
                            perm => ({
                                userId: id,
                                processName: perm.processName,
                                permissions: perm.permissions.join(',')
                            })
                        ),
                        { transaction }
                    );
                }

                await transaction.commit();
                return true;
            } catch (err) {
                console.log(err)
                await transaction.rollback();
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}