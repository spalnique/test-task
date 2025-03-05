'use server';

import { emailPattern, initSignUp } from '@/constants/auth';
import { signInUser, signUpUser } from '@/lib/api/auth/auth.api';
import { SignInFormState, SignUpFormState } from '@/types/auth.type';
import { AxiosError } from 'axios';

const validateEmail = <T extends SignInFormState | SignUpFormState>(
  formState: T
) => {
  if (!emailPattern.test(formState.email)) {
    formState.error = formState.email
      ? 'Email should be yourmail@example.com'
      : 'Email is required';
    formState.email = '';
  }

  return formState;
};

const validatePassword = <T extends SignInFormState | SignUpFormState>(
  formState: T
) => {
  if (formState.password.length < 8) {
    formState.error = formState.password
      ? 'Password should be at least 8 characters long'
      : 'Password is required';
    formState.password = '';
  }

  return formState;
};

const validateConfirm = (formState: SignUpFormState) => {
  if (formState.confirm !== formState.password) {
    formState.error = 'Passwords must be equal';
    formState.confirm = '';
  }

  return formState;
};

export const signupAction = async (
  prevState: SignUpFormState,
  formData: FormData
) => {
  const submitted = Object.fromEntries(formData);

  if (formData.get('back') === 'email') {
    return { ...prevState, email: '', password: '' };
  }
  if (formData.get('back') === 'password') {
    return { ...prevState, password: '', confirm: '' };
  }

  let newState = { ...prevState, ...submitted };

  newState.error = null;
  if ('email' in submitted) newState = validateEmail(newState);
  if ('password' in submitted) newState = validatePassword(newState);
  if ('confirm' in submitted) newState = validateConfirm(newState);
  if (newState.error) return newState;

  const isComplete = newState.email && newState.password && newState.confirm;

  if (isComplete) {
    try {
      const { user } = await signUpUser({
        email: newState.email,
        password: newState.password,
      });

      return { ...initSignUp, response: { user } };
    } catch (error) {
      if (error instanceof AxiosError) {
        newState.response.errors = error.response?.data.message.split('\n');
      }

      if (error instanceof Error) {
        newState.response.errors = [error.message];
      }
    }
  }

  return newState;
};

export const signinAction = async (
  prevState: SignInFormState,
  formData: FormData
) => {
  const submitted = Object.fromEntries(formData) as Partial<SignInFormState>;

  if (formData.get('back') === 'email') {
    return { ...prevState, email: '', password: '' };
  }

  let newState = { ...prevState, ...submitted };

  newState.error = null;
  if ('email' in submitted) newState = validateEmail(newState);
  if ('password' in submitted) newState = validatePassword(newState);
  if (newState.error) return newState;

  const isComplete = newState.email && newState.password;

  if (isComplete) {
    try {
      const { user } = await signInUser({
        email: newState.email,
        password: newState.password,
      });

      return { ...initSignUp, response: { user } };
    } catch (error) {
      if (error instanceof AxiosError) {
        newState.response.errors = error.response?.data.message.split('\n');
      }

      if (error instanceof Error) {
        newState.response.errors = [error.message];
      }
    }
  }

  return newState;
};
