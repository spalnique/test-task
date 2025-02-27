import { FastifyReply, FastifyRequest } from 'fastify';

import { authService } from '@services';
import { SignUpBody } from '@types';

export class AuthController {
  async signup(
    request: FastifyRequest<{ Body: SignUpBody }>,
    reply: FastifyReply
  ) {
    const user = await authService.createUser(request.body);
    return reply.status(201).send({
      success: true,
      user: { email: user.email },
    });
  }
}

export const authController = new AuthController();
