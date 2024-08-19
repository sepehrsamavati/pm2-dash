import tables from "./tables";
import type { Database } from "sqlite3";

export default function (database: Database) {
    database.serialize(async () => {
        database.run(`CREATE TABLE IF NOT EXISTS ${tables.users} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT,
            isActive INTEGER
        )`);

        database.run(`CREATE TABLE IF NOT EXISTS ${tables.userProcessPermissions} (
            userId INTEGER,
            processName TEXT,
            permissions INTEGER,
            FOREIGN KEY (userId) REFERENCES ${tables.users}(id)
        )`);
    });
}