import type { FastifyRequest } from "fastify";
import type { UserViewModel } from "../../../common/types/user";

declare module 'fastify' {
    interface FastifyRequest {
        locals: {
            /** May be null - Be sure to call jwt middleware */
            user: UserViewModel;
            dto: unknown;
        };
    }
}