import { UserModel } from '@models';
import { SignUpBody } from '@types';

export class AuthService {
  async createUser(payload: SignUpBody) {
    const existingUser = await UserModel.findOne({ email: payload.email });

    if (existingUser) {
      throw new Error('This email is already in use');
    }

    const user = await UserModel.create(payload);
    return user;
  }
}

export const authService = new AuthService();
