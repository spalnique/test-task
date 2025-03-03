import { FastifyInstance } from 'fastify';

import { authController } from '@controllers';
import { signupSchema as schema } from '@schemas';

export async function authHttpRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', { schema }, authController.signup);
}
