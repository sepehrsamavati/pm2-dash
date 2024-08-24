import type { onRequestHookHandler } from "fastify";
import { AccountType } from "../../../common/types/enums";

export const authGuard: onRequestHookHandler = (req, reply, done) => {
    if (req.locals.user)
        done();
    else
        reply.status(401).send({ message: "Authentication required!" });
};

export const accountTypeGuard = (type: AccountType | AccountType[]) => {
    const _type = Array.isArray(type) ? type : [type];
    return ((req, reply, done) => {

        if (_type.some(type => type === req.locals.user.type))
            done();
        else
            reply.status(403).send({ message: "Access forbidden!" });

    }) satisfies onRequestHookHandler;
};
