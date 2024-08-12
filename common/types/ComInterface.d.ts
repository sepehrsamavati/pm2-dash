import type { Pm2ProcessDescription } from "./pm2";

export type ElectronAPI = {
    clientReady: () => void;
    pm2: {
        getList: () => Promise<Pm2ProcessDescription[]>;
    };
}