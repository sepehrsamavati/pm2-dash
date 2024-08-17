import Fastify from 'fastify'
import PM2Service from '../../common/services/pm2';
import { jwtRequestGuard } from './middlewares/jwt';
import type { TargetProcess } from '../../common/types/ComInterface';

const pm2Service = new PM2Service();

pm2Service.connect();

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
        return await pm2Service.list();
    });

    instance.post("/restart", async (req) => {
        const body = req.body as TargetProcess;
        return await pm2Service.restart(body.id);
    });

    instance.post("/stop", async (req) => {
        const body = req.body as TargetProcess;
        return await pm2Service.stop(body.id);
    });

    instance.patch("/flush", async (req) => {
        const body = req.body as TargetProcess;
        return await pm2Service.flush(body.id);
    });

    instance.patch("/reset", async (req) => {
        const body = req.body as TargetProcess;
        return await pm2Service.reset(body.id);
    });

    next();
}, { prefix: "pm2" });

fastify.listen({
    port: 3005
})
    .then(() => {
        console.log("PM2 service server running...");
    });
