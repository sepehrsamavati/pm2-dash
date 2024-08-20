import config from "./config";
import PM2Service from "../../common/services/pm2";
import PM2Application from "./application/PM2Application";
import { createContainer, asClass, asValue } from "awilix";
import UserApplication from "./application/UserApplication";
import type * as RepoInterfaces from "./types/contracts/sqliteRepositories";
import SqliteConnection from "./infrastructure/repository/sqlite/Connection";
import UserRepository from "./infrastructure/repository/sqlite/UserRepository";

type Constants = {
    sqliteFilename: string;
};

type Connections = {
    databaseConnection: SqliteConnection;
    pm2Daemon: PM2Service;
};

type Repositories = {
    userRepository: RepoInterfaces.IUserRepository;
};

type Applications = {
    pm2Application: PM2Application;
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
            pm2Daemon: asClass(PM2Service, { lifetime: "SINGLETON", dispose: ctx => ctx.disconnect() }),

            userRepository: asClass(UserRepository, { lifetime: "SINGLETON" }),

            pm2Application: asClass(PM2Application, { lifetime: "SINGLETON" }),
            userApplication: asClass(UserApplication, { lifetime: "SINGLETON" }),
        });
    }

    destroy() {
        return this.container.dispose();
    }
}
