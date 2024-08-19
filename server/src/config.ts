import * as dotenv from "dotenv";
dotenv.config();

const config = Object.freeze({
    secret: process.env.JWT_SIGN_SECRET ?? "",
    sqliteFilename: "db.sqlite3"
});

if (!config.secret) {
    console.info("Config error; No JWT secret defined in environment!");
    process.exit(100);
}

export default config;
