import config from "./config";
import PM2Service from "../../common/services/pm2";
import { createContainer, asClass, asValue } from "awilix";
import type * as RepoInterfaces from "./types/contracts/sqliteRepositories";
import SqliteConnection from "./infrastructure/repository/sqlite/Connection";
import UserRepository from "./infrastructure/repository/sqlite/UserRepository";
import UserApplication from "./application/UserApplication";

type Constants = {
    sqliteFilename: string;
};

type Connections = {
    databaseConnection: SqliteConnection;
};

type Repositories = {
    userRepository: RepoInterfaces.IUserRepository;
};

type Applications = {
    pm2Service: PM2Service;
    userApplication: UserApplication;
};

export type ServicesType = Constants & Connections & Repositories & Applications;

export default class Services {
    private readonly container = createContainer<ServicesType>({
        strict: true,
        injectionMode: "PROXY"
    });

    public get databaseConnection() {
        return this.container.cradle.databaseConnection;
    }

    public readonly applications: Applications = this.container.cradle;
    public readonly repositories: Repositories = this.container.cradle;

    constructor() {
        this.container.register({
            sqliteFilename: asValue(config.sqliteFilename),

            databaseConnection: asClass(SqliteConnection, { lifetime: "SINGLETON", dispose: async ctx => ctx.close() }),

            userRepository: asClass(UserRepository, { lifetime: "SINGLETON" }),

            pm2Service: asClass(PM2Service, { lifetime: "SINGLETON", dispose: ctx => ctx.disconnect() }),
            userApplication: asClass(UserApplication, { lifetime: "SINGLETON" }),
        });
    }

    destroy() {
        return this.container.dispose();
    }
}
