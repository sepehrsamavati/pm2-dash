import { verifyToken } from "../utils/jwt";
import type { onRequestHookHandler } from "fastify";

const key = "AccessToken".toLowerCase();

export const jwtRequestGuard: onRequestHookHandler = (request, reply, done) => {
    const token = request.headers[key];
    if (typeof token !== "string" || !verifyToken(token))
        reply.status(401).send({ message: "Auth required!" });
    else
        done();
};