import { SignInFormState, SignUpFormState } from '@/types/auth.type';

const initSignUp: SignUpFormState = {
  email: '',
  password: '',
  confirm: '',
  validationError: null,
  user: null,
  apiErrors: null,
};

const initSignIn: SignInFormState = {
  email: '',
  password: '',
  validationError: null,
  user: null,
  apiErrors: null,
};

const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;

export { initSignUp, initSignIn, emailPattern };
