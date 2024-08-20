import type { User } from "../../../../../../common/types/user";
import { DataTypes, type Model, type Sequelize } from "sequelize";
import { AccountType } from "../../../../../../common/types/enums";
import type { CreateModel, UserDbModel, UserProcessPermissionDbModel } from "./entities";

export default class Models {
    public readonly user;
    public readonly userProcessPermission;

    constructor(
        sequelize: Sequelize
    ) {
        this.user = sequelize.define<Model<UserDbModel, CreateModel<UserDbModel>>>('User', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,

            },
            type: {
                type: DataTypes.INTEGER,
                validate: {
                    isInt: true,
                    min: AccountType.Admin,
                    max: AccountType.Member,
                }
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    len: [3, 12],
                    isLowercase: true,
                }
            },
            password: DataTypes.STRING,
            isActive: DataTypes.BOOLEAN
        });

        this.userProcessPermission = sequelize.define<Model<UserProcessPermissionDbModel>>('UserProcessPermission', {
            userId: DataTypes.INTEGER,
            processName: DataTypes.STRING,
            permissions: DataTypes.STRING,
        });

        this.user.hasMany(this.userProcessPermission, {
            as: 'processPermissions' satisfies keyof User,
            foreignKey: 'userId' satisfies keyof UserProcessPermissionDbModel
        });

        sequelize.sync();
    }
}