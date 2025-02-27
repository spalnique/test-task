import { FastifyInstance } from 'fastify';

import { authController } from '@controllers';
import { signupSchema } from '@schemas';

export default async function authRoute(fastify: FastifyInstance) {
  fastify.post('/signup', { schema: signupSchema }, authController.signup);
}
