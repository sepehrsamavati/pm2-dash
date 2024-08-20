import "./config";
import fs from 'node:fs/promises';
import LoginDTO from './dto/LoginDTO';
import { signToken } from './utils/jwt';
import services from './servicesInstance';
import { jwtResolve } from './middlewares/jwt';
import CreateUserDTO from "./dto/user/CreateUserDTO";
import Fastify, { type FastifyRequest } from 'fastify';
import { AccountType } from "../../common/types/enums";
import { dtoValidator } from './middlewares/dtoValidator';
import type { UserViewModel } from '../../common/types/user';
import { accountTypeGuard, authGuard } from "./middlewares/guards";
import type { TargetProcess } from '../../common/types/ComInterface';
import { OperationResultWithData } from '../../common/models/OperationResult';

services.applications.pm2Service.connect();

const fastify = Fastify({
    logger: true,
});

fastify.addHook('onRequest', function (req, _, done) {
    req.locals = {
        user: null as unknown as UserViewModel,
        dto: null
    };
    done();
});

fastify.post("/login", { preValidation: dtoValidator(LoginDTO) }, async (req, reply) => {
    const payload = req.locals.dto as LoginDTO;
    const result = new OperationResultWithData<string>();
    const loginResult = await services.applications.userApplication.login(payload.username, payload.password);

    if (loginResult.ok && loginResult.data) {
        const token = signToken(loginResult.data);
        result.setData(token);
    } else {
        result.failed(loginResult.message);
    }

    return result;
});

fastify.register((instance, _, next) => {
    instance.addHook("onRequest", jwtResolve);
    instance.addHook("onRequest", authGuard);

    instance.put("/create", { onRequest: [accountTypeGuard(AccountType.Admin)], preValidation: dtoValidator(CreateUserDTO) }, async (req) => {
        return services.applications.userApplication.create(req.locals.dto as CreateUserDTO);
    });

    next();
}, { prefix: "user" });

fastify.register((instance, _, next) => {
    instance.addHook("onRequest", jwtResolve);
    instance.addHook("onRequest", authGuard);

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
