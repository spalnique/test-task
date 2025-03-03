import { FastifyPluginAsync } from 'fastify';

import {
  authHttpRoutes,
  finnhubAPIWebSocketRoute,
  realtimeAPIWebSocketRoute,
} from '@routes';

export const routerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(realtimeAPIWebSocketRoute);
  await fastify.register(finnhubAPIWebSocketRoute);
  await fastify.register(authHttpRoutes, { prefix: '/api/auth' });
};
