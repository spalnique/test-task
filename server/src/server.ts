import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import Fastify from 'fastify';

import { corsConfig, serverConfig } from '@configs';
import {
  errorHandlerPlugin,
  mongoosePlugin,
  notFoundPlugin,
  routerPlugin,
} from '@plugins';

(async () => {
  const app = Fastify();

  await app.register(errorHandlerPlugin);
  await app.register(fastifyCors, corsConfig);
  await app.register(fastifyWebsocket);
  await app.register(mongoosePlugin);
  await app.register(routerPlugin);
  await app.register(notFoundPlugin);

  await app.listen(serverConfig, (err) => {
    if (err) {
      console.log('Failed to start the server');
      console.error(err);
      app.log.error(err);
      process.exit(1);
    }
  });

  const address = app.server.address();

  let url: string;

  if (typeof address === 'string') {
    url = address;
  } else if (address?.address === '::') {
    url = `http://localhost:${serverConfig.port}`;
  } else {
    url = `${address?.address}:${address?.port}`;
  }

  console.log(`Server is running at ${url}`);
})();
