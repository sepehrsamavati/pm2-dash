import { createContext, useContext } from "react";
import type { IPm2Connection } from "../types/pm2Connection";

export default class Session {
    pm2Connection?: IPm2Connection;
}

export const SessionContext = createContext({} as Session);

export const useSession = () => useContext(SessionContext);
