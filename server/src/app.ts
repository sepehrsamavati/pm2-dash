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
import PM2TargetProcessDTO from "./dto/pm2/PM2TargetProcessDTO";

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

    instance.get("/list", async (req) => {
        return await services.applications.pm2Application.getList(req.locals.user);
    });

    instance.post("/restart", { preValidation: dtoValidator(PM2TargetProcessDTO) }, async (req) => {
        return await services.applications.pm2Application.restart({
            user: req.locals.user,
            pmId: (req.locals.dto as PM2TargetProcessDTO).pmId
        });
    });

    instance.post("/stop", { preValidation: dtoValidator(PM2TargetProcessDTO) }, async (req) => {
        return await services.applications.pm2Application.stop({
            user: req.locals.user,
            pmId: (req.locals.dto as PM2TargetProcessDTO).pmId
        });
    });

    instance.patch("/flush", { preValidation: dtoValidator(PM2TargetProcessDTO) }, async (req) => {
        return await services.applications.pm2Application.flush({
            user: req.locals.user,
            pmId: (req.locals.dto as PM2TargetProcessDTO).pmId
        });
    });

    instance.patch("/reset", { preValidation: dtoValidator(PM2TargetProcessDTO) }, async (req) => {
        return await services.applications.pm2Application.reset({
            user: req.locals.user,
            pmId: (req.locals.dto as PM2TargetProcessDTO).pmId
        });
    });

    instance.get("/outFilePath", { preValidation: dtoValidator(PM2TargetProcessDTO) }, async (req, reply) => {
        const result = await services.applications.pm2Application.readOutputLogFile({
            user: req.locals.user,
            pmId: (req.locals.dto as PM2TargetProcessDTO).pmId
        });
        if (result.data)
            return await fs.readFile(result.data);
        else
            return reply.status(404);
    });

    instance.get("/errFilePath", { preValidation: dtoValidator(PM2TargetProcessDTO) }, async (req, reply) => {
        const result = await services.applications.pm2Application.readErrorLogFile({
            user: req.locals.user,
            pmId: (req.locals.dto as PM2TargetProcessDTO).pmId
        });
        if (result.data)
            return await fs.readFile(result.data);
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
