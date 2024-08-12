import { app } from "electron";

const config = {
    isDevelopment: !app.isPackaged
};

Object.freeze(config);

export default config as Readonly<typeof config>;
