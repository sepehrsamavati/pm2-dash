import { FastifyReply } from "fastify";

declare module 'fastify' {
    interface FastifyReply {
        locals: {
            dto: unknown;
        };
    }
}