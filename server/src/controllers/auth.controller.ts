import { FastifyReply, FastifyRequest } from 'fastify';

import { SuccesMessages } from '@constants';
import { authService } from '@services';
import { SignUpBody } from '@types';

export class AuthController {
  async signup(req: FastifyRequest<{ Body: SignUpBody }>, res: FastifyReply) {
    const user = await authService.createUser(req.body);

    return res.status(201).send({ message: SuccesMessages.SIGN_UP, user });
  }

  async signin(req: FastifyRequest<{ Body: SignUpBody }>, res: FastifyReply) {
    const user = await authService.findUser(req.body);

    return res.status(201).send({ message: SuccesMessages.SIGN_IN, user });
  }

  async signout(_req: FastifyRequest<{ Body: SignUpBody }>, res: FastifyReply) {
    await authService.terminateSession();

    return res.status(201).send({ message: SuccesMessages.SIGN_OUT });
  }
}

export const authController = new AuthController();
