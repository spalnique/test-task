import { FastifyPluginAsync } from 'fastify';

import { authRoutes, websocketRoute } from '@routes';

export const routerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(websocketRoute);
  await fastify.register(authRoutes, { prefix: '/api/auth' });
};
