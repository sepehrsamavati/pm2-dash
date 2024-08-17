import jwt from "jsonwebtoken";
import config from "../config";

export const signToken = (expiresIn: string) => jwt.sign({}, config.secret, { expiresIn });

export const verifyToken = (token: string) => {
    try {
        jwt.verify(token, config.secret);
        return true;
    } catch {
        return false;
    }
};
