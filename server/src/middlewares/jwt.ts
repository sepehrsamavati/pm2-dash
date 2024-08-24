import services from "../servicesInstance";
import { verifyToken } from "../utils/jwt";
import type { onRequestHookHandler } from "fastify";

const key = "AccessToken".toLowerCase();

export const jwtResolve: onRequestHookHandler = async (request, reply) => {
    const token = request.headers[key];

    if (typeof token === "string") {
        const payload = verifyToken(token);
        if (payload) {
            const user = await services.applications.userApplication.getViewModelByUsername(payload.username);
            if (user)
                request.locals.user = user;
        }
    }

    return;
};