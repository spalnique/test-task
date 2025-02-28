import { FastifyPluginAsync } from 'fastify';

import { ErrorMessages } from '@constants';

export const notFoundPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setNotFoundHandler((_req, res) => {
    res.status(404).send({
      status: 404,
      message: ErrorMessages.ROUTE_NOT_FOUND,
    });
  });
};
