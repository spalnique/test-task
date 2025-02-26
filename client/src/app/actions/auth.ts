'use server';

import { SignInValues, SignUpValues } from '@/@types/form.type';
import { initSignIn, initSignUp } from '@/constants/forms';

export const signup = async (prevState: SignUpValues, formData: FormData) => {
  const submitted = Object.fromEntries(formData) as Partial<SignUpValues>;

  const newState = { ...prevState, ...submitted } as SignUpValues;

  newState.error = null;

  const isCompleted = newState.email && newState.password && newState.confirm;

  if ('confirm' in submitted && newState.password !== submitted.confirm) {
    newState.error = 'Passwords should be equal';
    console.log('on not equal', newState);
    return newState;
  }

  if (isCompleted && !newState.error) {
    const body = JSON.stringify(newState);
    console.log('Data submitted', body);
    return initSignUp;
  }
  console.log('before return', newState);
  return newState;
};

export const signin = async (prevState: SignInValues, formData: FormData) => {
  const submitted = Object.fromEntries(formData) as Partial<SignInValues>;

  const newState = { ...prevState, ...submitted } as SignInValues;

  const isCompleted = newState.email && newState.password;

  if (isCompleted) {
    const body = JSON.stringify(newState);
    console.log('Data submitted', body);
    return initSignIn;
  }

  return newState;
};
