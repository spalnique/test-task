import createHttpError from 'http-errors';

import { ErrorMessages } from '@constants';
import { UserModel } from '@models';
import { SignInBody, SignUpBody } from '@types';

export class AuthService {
  async createUser({ email, password }: SignUpBody) {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw createHttpError(409, 'This email is already in use');
    }

    return await UserModel.create({ email, password });
  }

  async findUser({ email, password }: SignInBody) {
    const user = await UserModel.findOne({ email });
    const isValid = await user.comparePassword(password);

    if (!user || !isValid) {
      throw createHttpError(401, ErrorMessages.BAD_CREDENTIALS);
    }

    return user;
  }
}

export const authService = new AuthService();
