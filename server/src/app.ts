import Fastify from 'fastify';
import fs from 'node:fs/promises';
import Services from './Services';
import { jwtRequestGuard } from './middlewares/jwt';
import type { TargetProcess } from '../../common/types/ComInterface';

const services = new Services();

services.applications.pm2Service.connect();

const fastify = Fastify({
    logger: true,
});

fastify.addHook("onRequest", jwtRequestGuard);

fastify.register((instance, _, next) => {
    instance.get("/", () => {
        return {
            ok: true
        };
    });

    instance.get("/list", async () => {
        return await services.applications.pm2Service.list();
    });

    instance.post("/restart", async (req) => {
        const body = req.body as TargetProcess;
        return await services.applications.pm2Service.restart(body.id);
    });

    instance.post("/stop", async (req) => {
        const body = req.body as TargetProcess;
        return await services.applications.pm2Service.stop(body.id);
    });

    instance.patch("/flush", async (req) => {
        const body = req.body as TargetProcess;
        return await services.applications.pm2Service.flush(body.id);
    });

    instance.patch("/reset", async (req) => {
        const body = req.body as TargetProcess;
        return await services.applications.pm2Service.reset(body.id);
    });

    instance.get("/outFilePath", async (req, reply) => {
        const body = req.query as TargetProcess;
        const path = await services.applications.pm2Service.getLogPath(body.id, "out");
        if (path)
            return await fs.readFile(path);
        else
            return reply.status(404);
    });

    instance.get("/errFilePath", async (req, reply) => {
        const body = req.query as TargetProcess;
        const path = await services.applications.pm2Service.getLogPath(body.id, "err");
        if (path)
            return await fs.readFile(path);
        else
            return reply.status(404);
    });

    next();
}, { prefix: "pm2" });

fastify.listen({
    port: 3005
})
    .then(() => {
        console.log("PM2 service server running...");
    });
