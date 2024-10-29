import "reflect-metadata";
import * as dotenv from "dotenv";
import packageJsonReader from "../../common/helpers/packageJsonReader";
import ConfigError from "../../common/models/ConfigError";
dotenv.config();

const appVersion = packageJsonReader("./package.json", "version");

const config = Object.freeze({
    secret: process.env.PM2GS_JWT_SIGN_SECRET ?? "",
    adminPassword: process.env.PM2GS_ADMIN_PASSWORD ?? "",
    serverPort: Number.parseInt(process.env.PM2GS_LISTEN_PORT || "3005"),
    replaceHttpStandardMethods: process.env.PM2GS_REPLACE_HTTP_STANDARD?.toLowerCase() === "true",
    sqliteFilename: "db.sqlite3",
    passwordSaltLength: 32,
    jwtExpiresIn: "1d",
    majorVersion: Number.parseInt(appVersion.split(".")[0]),
    appVersion: appVersion,
});

if (config.replaceHttpStandardMethods)
    console.info(`Replace HTTP standard is activate; Delete -> Get | Put/Patch -> Post`);

if (Number.isNaN(config.majorVersion))
    new ConfigError("Couldn't read package version");

export default config;
