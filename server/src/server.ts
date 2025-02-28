import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import Fastify from 'fastify';

import { corsConfig, fastifyConfig, serverConfig } from '@configs';
import {
  errorHandlerPlugin,
  mongoosePlugin,
  notFoundPlugin,
  routerPlugin,
} from '@plugins';

(() => {
  const app = Fastify(fastifyConfig);

  app.register(fastifyCors, corsConfig);
  app.register(fastifyWebsocket);
  app.register(mongoosePlugin);
  app.register(routerPlugin);
  app.register(errorHandlerPlugin);
  app.register(notFoundPlugin);

  app.listen(serverConfig, (err) => {
    if (err) {
      console.log('Failed to start the server');
      console.error(err);
      app.log.error(err);
      process.exit(1);
    }
  });

  console.log(`Server is running at ${serverConfig.port}`);
})();
