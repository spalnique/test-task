import { FastifyError, FastifyInstance, FastifyPluginAsync } from 'fastify';
import { isHttpError } from 'http-errors';

import { ErrorMessages } from '@constants';

export const errorHandlerPlugin: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.setErrorHandler((err: FastifyError | Error, req, res) => {
    req.log.error(err);

    if (isHttpError(err)) {
      return res.status(err.status).send({
        status: err.status,
        message: err.message,
      });
    }

    return res.status(500).send({
      status: 500,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  });
};
