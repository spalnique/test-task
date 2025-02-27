import { FastifyPluginAsync } from 'fastify';

import { ErrorMessage } from '@constants';

const notFoundPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setNotFoundHandler((_req, res) => {
    res.status(404).send({
      status: 404,
      message: ErrorMessage.ROUTE_NOT_FOUND,
    });
  });
};

export default notFoundPlugin;
