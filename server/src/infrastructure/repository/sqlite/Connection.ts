import { DataTypes, Model, Sequelize } from "sequelize";
import type { CreateModel, UserDbModel, UserProcessPermissionDbModel } from "./configuration/entities";

class Models {
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
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            isActive: DataTypes.BOOLEAN
        });

        this.userProcessPermission = sequelize.define<Model<UserProcessPermissionDbModel>>('UserProcessPermission', {
            userId: DataTypes.INTEGER,
            processName: DataTypes.STRING,
            permissions: DataTypes.STRING,
        });

        this.user.hasMany(this.userProcessPermission, { foreignKey: 'userId' satisfies keyof UserProcessPermissionDbModel });

        sequelize.sync();
    }
}

export default class SqliteConnection {
    public readonly instance = new Sequelize("sqlite:./db.sqlite3");
    public readonly models = new Models(this.instance);

    constructor() {
        // initDatabase(this.instance);
    }

    async close() {
        await this.instance.close();
    }
}
