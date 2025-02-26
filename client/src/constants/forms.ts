import { SignInValues, SignUpValues } from '@/@types/form.type';

const initSignUp: SignUpValues = {
  email: '',
  password: '',
  confirm: '',
  error: null,
};

const initSignIn: SignInValues = {
  email: '',
  password: '',
};

export { initSignUp, initSignIn };
