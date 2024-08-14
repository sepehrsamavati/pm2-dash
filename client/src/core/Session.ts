import { createContext, useContext } from "react";
import type { IPm2Connection } from "../types/pm2Connection";

export default class Session {

    constructor(
        readonly refreshUI: () => void
    ) { }

    private _pm2Connection?: IPm2Connection;
    public get pm2Connection() {
        return this._pm2Connection;
    }
    public set pm2Connection(v: IPm2Connection | undefined) {
        this._pm2Connection = v;
        this.refreshUI();
    }

}

export const SessionContext = createContext({} as Session);

export const useSession = () => useContext(SessionContext);
