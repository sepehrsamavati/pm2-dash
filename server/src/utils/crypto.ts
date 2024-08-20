import crypto from "node:crypto";
import config from "../config";

export const generateSalt = (length = 16) => {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

export const password = {
    encode: (plainText: string, salt?: string) => {
        try {
            const _salt = salt ?? generateSalt(config.passwordSaltLength);
            const encoded = crypto.pbkdf2Sync(plainText, _salt, 1e6, 64, "SHA512");
            return _salt + ':' + encoded.toString('hex');
        } catch (e: unknown) {
            console.error("Password encrypt / " + (e instanceof Error ? e.message : e));
            return null;
        }
    },
    /**
     * Compare raw input password with stored hashed password and return if they are equal
    */
    compare: (plainTextPassword: string, encodedPassword: string) => {
        const [passwordSalt] = encodedPassword.split(":");
        return password.encode(plainTextPassword, passwordSalt) === encodedPassword;
    }
} as const;
