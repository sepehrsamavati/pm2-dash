import jwt from "jsonwebtoken";
import config from "../config";
import type { JwtPayload } from "../types/jwtPayload";

export const signToken = (username: string) => jwt.sign({ username } satisfies JwtPayload, config.secret, { expiresIn: config.jwtExpiresIn });

export const verifyToken = (token: string) => {
    try {
        const res = jwt.verify(token, config.secret) as JwtPayload;
        return typeof res === "object" ? res : null;
    } catch {
        return null;
    }
};
