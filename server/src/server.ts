import fastifyWebsocket from '@fastify/websocket';
import Fastify from 'fastify';

import { serverConfig } from '@configs';
import { RealtimeAPIService } from '@services';

const fastify_ws = Fastify();

fastify_ws.register(fastifyWebsocket);
fastify_ws.register(async function (fastify) {
  fastify.get('/', { websocket: true }, function (client_ws) {
    console.log('Client connected');

    try {
      new RealtimeAPIService(client_ws);
    } catch (error) {
      console.error('Error connection to OpenAI Realtime API', error);
      client_ws.send('Error connection to OpenAI Realtime API');
    }
  });
});

fastify_ws.listen({ port: serverConfig.port }, (err) => {
  if (err) {
    fastify_ws.log.error(err);
    process.exit(1);
  }
});
