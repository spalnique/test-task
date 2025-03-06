'use server';

import { emailPattern, initSignIn, initSignUp } from '@/constants/auth';
import { signInUser, signUpUser } from '@/lib/api/auth/auth.api';
import { SignInFormState, SignUpFormState } from '@/types/auth.type';
import { AxiosError } from 'axios';

const validateEmail = <T extends SignInFormState | SignUpFormState>(
  formState: T
) => {
  if (!emailPattern.test(formState.email)) {
    formState.validationError = formState.email
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
    formState.validationError = formState.password
      ? 'Password should be at least 8 characters long'
      : 'Password is required';
    formState.password = '';
  }

  return formState;
};

const validateConfirm = (formState: SignUpFormState) => {
  if (formState.confirm !== formState.password) {
    formState.validationError = 'Passwords must be equal';
    formState.confirm = '';
  }

  return formState;
};

export const signUpAction = async (
  prevState: SignUpFormState,
  formData: FormData
) => {
  if (formData.get('back') === 'email') {
    return { ...prevState, email: '', password: '' };
  }
  if (formData.get('back') === 'password') {
    return { ...prevState, password: '', confirm: '' };
  }

  const submitted = Object.fromEntries(formData);

  let newState = {
    ...prevState,
    ...submitted,
    validationError: null,
    apiErrors: null,
  } as SignUpFormState;

  if ('email' in submitted) newState = validateEmail(newState);
  if ('password' in submitted) newState = validatePassword(newState);
  if ('confirm' in submitted) newState = validateConfirm(newState);
  if (newState.validationError) return newState;

  const isComplete = newState.email && newState.password && newState.confirm;

  if (isComplete) {
    try {
      const { user } = await signUpUser({
        email: newState.email,
        password: newState.password,
      });

      newState = { ...initSignUp, user };
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiErrors = error.response?.data.message.split('\n');
        newState = { ...initSignUp, apiErrors };
      } else if (error instanceof Error) {
        const apiErrors = [error.message];
        newState = { ...initSignUp, apiErrors };
      }
    }
  }

  return newState;
};

export const signInAction = async (
  prevState: SignInFormState,
  formData: FormData
) => {
  if (formData.get('back') === 'email') {
    return { ...prevState, email: '', password: '' };
  }

  const submitted = Object.fromEntries(formData) as Partial<SignInFormState>;

  let newState = {
    ...prevState,
    ...submitted,
    validationError: null,
    apiErrors: null,
  } as SignInFormState;

  if ('email' in submitted) newState = validateEmail(newState);
  if (newState.validationError) return newState;

  const isComplete = newState.email && newState.password;

  if (isComplete) {
    try {
      const { user } = await signInUser({
        email: newState.email,
        password: newState.password,
      });

      newState = { ...initSignIn, user };
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiErrors = error.response?.data.message.split('\n');
        newState = { ...initSignIn, apiErrors };
      } else if (error instanceof Error) {
        const apiErrors = [error.message];
        newState = { ...initSignIn, apiErrors };
      }
    }
  }

  return newState;
};
