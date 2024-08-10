import fastify from 'fastify';

const server = fastify();

export default class Application {
    #server = fastify();

    initialize() {
        server.get('/', async (request, reply) => {
            return { hello: 'world' };
        });

        return this;
    }

    async start() {
        try {
            await server.listen({
                port: 3000
            });
            console.log('Server running on port 3000');
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
}
