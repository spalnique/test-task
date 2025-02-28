import { FastifyInstance } from 'fastify';

import { authController } from '@controllers';
import { signupSchema as schema } from '@schemas';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', { schema }, authController.signup);
}
