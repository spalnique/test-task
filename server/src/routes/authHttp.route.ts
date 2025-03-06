import { FastifyInstance } from 'fastify';

import { authController } from '@controllers';
import { authSchema as schema } from '@schemas';

export async function authHttpRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', { schema }, authController.signup);
  fastify.post('/signin', { schema }, authController.signin);
  fastify.get('/signout', authController.signout);
}
