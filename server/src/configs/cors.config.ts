import { FastifyCorsOptions } from '@fastify/cors';

export const corsConfig: FastifyCorsOptions = {
  origin: ['http://localhost:3000'],
};
