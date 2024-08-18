import { createContext, useContext } from "react";
import LocalStorageHelper from "./helpers/LocalStorage";
import type { IPm2Connection } from "../types/pm2Connection";
import type { LocalStorage_v1 } from "../types/localStorage";
import snackbarProvider, { closeSnackbar } from "./helpers/snackbarProvider";

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


    public readonly snackbarProvider = snackbarProvider;
    public readonly closeSnackbar = closeSnackbar;

    public readonly localStorage = new LocalStorageHelper<LocalStorage_v1>({
        history: []
    });
}

export const SessionContext = createContext({} as Session);

export const useSession = () => useContext(SessionContext);
