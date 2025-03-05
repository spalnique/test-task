import { SignInFormState, SignUpFormState } from '@/types/auth.type';

const initSignUp: SignUpFormState = {
  email: '',
  password: '',
  confirm: '',
  error: null,
  response: { user: null },
};

const initSignIn: SignInFormState = {
  email: '',
  password: '',
  error: null,
  response: { user: null },
};

const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;

export { initSignUp, initSignIn, emailPattern };
