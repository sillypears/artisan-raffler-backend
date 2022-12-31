'use strict'

const app = require('fastify')({ logger: true });
const cors = require('@fastify/cors')

require('dotenv').config();

app.register(cors, {
})

const rootRoutes = require('./routes/root');
rootRoutes.forEach((route, index) => {
    app.route(route);
})

app.listen({ port: process.env.PORT }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`server listening on ${address}`);
})