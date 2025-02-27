import { FastifyPluginAsync } from 'fastify';

import { authRoute, websocketRoute } from '@routes';

const routerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(websocketRoute);
  await fastify.register(authRoute, { prefix: '/api/auth' });
};

export default routerPlugin;
