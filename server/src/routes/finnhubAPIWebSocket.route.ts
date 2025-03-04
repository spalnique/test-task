import { FinnhubAPIService } from '@services/finnhub.service';
import { FastifyInstance } from 'fastify';

export async function finnhubAPIWebSocketRoute(fastify: FastifyInstance) {
  fastify.get('/stock', { websocket: true }, (client_ws) => {
    console.log('Client connected');

    new FinnhubAPIService(client_ws);
  });
}
