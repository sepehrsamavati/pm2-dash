import "reflect-metadata";
import * as dotenv from "dotenv";
import packageJsonReader from "../../common/helpers/packageJsonReader";
import ConfigError from "../../common/models/ConfigError";
dotenv.config();

const config = Object.freeze({
    secret: process.env.PM2GS_JWT_SIGN_SECRET ?? "",
    adminPassword: process.env.PM2GS_ADMIN_PASSWORD ?? "",
    serverPort: Number.parseInt(process.env.PM2GS_LISTEN_PORT || "3005"),
    sqliteFilename: "db.sqlite3",
    passwordSaltLength: 32,
    jwtExpiresIn: "1d",
    majorVersion: Number.parseInt(packageJsonReader("./package.json", "version").split(".")[0])
});

if (Number.isNaN(config.majorVersion))
    new ConfigError("Couldn't read package version");

export default config;
