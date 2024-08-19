import sqlite3 from "sqlite3";
import initDatabase from "./configuration/initDatabase";
import { Permission } from "../../../../../common/types/enums";


export default class SqliteConnection {
    public readonly connection = new sqlite3.Database("./db.sqlite3");

    constructor() {
        initDatabase(this.connection);
    }

    close() {
        this.connection.close();
    }
}
