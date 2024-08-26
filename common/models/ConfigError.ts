import { ExitCode } from "../types/enums.js";

export default class ConfigError {
    constructor(message: string) {
        console.error(`Config error\n${message}`);
        process.exit(ExitCode.ConfigError);
    }
}
