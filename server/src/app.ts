import "./config";
import Fastify from 'fastify';
import fs from 'node:fs/promises';
import LoginDTO from './dto/LoginDTO';
import { signToken } from './utils/jwt';
import services from './servicesInstance';
import { jwtResolve } from './middlewares/jwt';
import CreateUserDTO from "./dto/user/CreateUserDTO";
import { dtoValidator } from './middlewares/dtoValidator';
import type { UserViewModel } from '../../common/types/user';
import PM2TargetProcessDTO from "./dto/pm2/PM2TargetProcessDTO";
import { accountTypeGuard, authGuard } from "./middlewares/guards";
import { AccountType, ClientServerInitHello } from "../../common/types/enums";
import { OperationResultWithData } from '../../common/models/OperationResult';
import EditUserDTO from "./dto/user/EditUserDTO";

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

fastify.post("/login", { preValidation: dtoValidator(LoginDTO) }, async (req) => {
    const payload = req.locals.dto as LoginDTO;
    const result = new OperationResultWithData<string>();
    const loginResult = await services.applications.userApplication.login(payload.username, payload.password);

    if (loginResult.ok && loginResult.data) {
        const token = signToken(loginResult.data);
        result.setData(token).succeeded();
    } else {
        result.failed(loginResult.message);
    }

    return result;
});

fastify.get("/user/me", { onRequest: [jwtResolve, authGuard] }, async (req) => {
    return req.locals.user;
});

fastify.register((instance, _, next) => {
    instance.addHook("onRequest", jwtResolve);
    instance.addHook("onRequest", authGuard);
    instance.addHook("onRequest", accountTypeGuard(AccountType.Admin));

    instance.get("/list", async () => {
        return await services.applications.userApplication.getAllViewModel();
    });

    instance.put("/create", { preValidation: dtoValidator(CreateUserDTO) }, async (req, reply) => {
        return reply.send(await services.applications.userApplication.create(req.locals.dto as CreateUserDTO));
    });

    instance.patch("/edit", { preValidation: dtoValidator(EditUserDTO) }, async (req, reply) => {
        return reply.send(await services.applications.userApplication.edit(req.locals.dto as EditUserDTO));
    });

    instance.patch("/activate/:id", async (req) => {
        const id = Number.parseInt((req.params as any)?.id);
        return await services.applications.userApplication.activate(id);
    });

    instance.patch("/deactivate/:id", async (req) => {
        const id = Number.parseInt((req.params as any)?.id);
        return await services.applications.userApplication.deactivate(id);
    });

    next();
}, { prefix: "user" });

fastify.get("/hello", (req, reply) => {
    const shouldRepeat = req.headers[ClientServerInitHello.ClientKey];
    return reply.header(ClientServerInitHello.ServerKey, shouldRepeat).send({});
});

fastify.register((instance, _, next) => {
    instance.addHook("onRequest", jwtResolve);
    instance.addHook("onRequest", authGuard);

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
