import { FastifyInstance } from 'fastify';

import { RealtimeAPIService } from '@services';

export async function realtimeAPIWebSocketRoute(fastify: FastifyInstance) {
  fastify.get('/assistant', { websocket: true }, (client_ws) => {
    console.log('Client connected');

    try {
      new RealtimeAPIService(client_ws);
    } catch (error) {
      console.error('Error connection to OpenAI Realtime API', error);
      client_ws.send('Error connection to OpenAI Realtime API');
    }
  });
}
