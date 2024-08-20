import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

const config = Object.freeze({
    secret: process.env.PM2GS_JWT_SIGN_SECRET ?? "",
    adminPassword: process.env.PM2GS_ADMIN_PASSWORD ?? "",
    sqliteFilename: "db.sqlite3",
    passwordSaltLength: 32,
    jwtExpiresIn: "1d"
});

if (!config.secret) {
    console.info("Config error; No JWT secret defined in environment!");
    process.exit(100);
}

export default config;
