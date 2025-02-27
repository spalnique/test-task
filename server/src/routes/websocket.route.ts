import { FastifyInstance } from 'fastify';

import { RealtimeAPIService } from '@services';

export default async function websocketRoute(fastify: FastifyInstance) {
  fastify.get('/', { websocket: true }, (client_ws) => {
    console.log('Client connected');

    try {
      new RealtimeAPIService(client_ws);
    } catch (error) {
      console.error('Error connection to OpenAI Realtime API', error);
      client_ws.send('Error connection to OpenAI Realtime API');
    }
  });
}
