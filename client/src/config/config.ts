import { app } from "electron";
import ConfigError from "../../../common/models/ConfigError";

const config = {
    version: app.getVersion(),
    majorVersion: Number.parseInt(app.getVersion().split(".")[0])
};

if (Number.isNaN(config.majorVersion))
    new ConfigError("Couldn't read app version");

Object.freeze(config);

export default config as Readonly<typeof config>;
