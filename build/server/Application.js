"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Application_server;
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)();
class Application {
    constructor() {
        _Application_server.set(this, (0, fastify_1.default)());
    }
    initialize() {
        server.get('/', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            return { hello: 'world' };
        }));
        return this;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield server.listen({
                    port: 3000
                });
                console.log('Server running on port 3000');
            }
            catch (err) {
                console.error(err);
                process.exit(1);
            }
        });
    }
}
_Application_server = new WeakMap();
exports.default = Application;
