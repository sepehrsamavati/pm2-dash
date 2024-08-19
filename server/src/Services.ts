import config from "./config";
import { createContainer, asClass, asValue } from "awilix";
import type * as RepoInterfaces from "./types/contracts/sqliteRepositories";
import SqliteConnection from "./infrastructure/repository/sqlite/Connection";
import UserRepository from "./infrastructure/repository/sqlite/UserRepository";

type Constants = {
    sqliteFilename: string;
};

type Connections = {
    databaseConnection: SqliteConnection;
};

type Repositories = {
    userRepository: RepoInterfaces.IUserRepository;
};

type Applications = {};

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

    constructor(){
        this.container.register({
            sqliteFilename: asValue(config.sqliteFilename),

            databaseConnection: asClass(SqliteConnection, { lifetime: "SINGLETON", dispose: async ctx => ctx.close() }),

            userRepository: asClass(UserRepository, { lifetime: "SINGLETON" }),
        });

    }

    destroy() {
        return this.container.dispose();
    }
}
