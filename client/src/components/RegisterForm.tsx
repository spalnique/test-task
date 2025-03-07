import { signUpAction } from '@/app/actions/auth';
import { initSignUp } from '@/constants/auth';
import { Form } from '@heroui/react';
import { redirect } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import BackButton from './BackButton';
import FormInput from './FormInput';
import FormTitle from './FormTitle';
import HaveAnAccount from './HaveAnAccount';
import SubmitButton from './SubmitButton';

export default function RegisterForm() {
  const persistedValuesRef = useRef(initSignUp);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const [validationError, setValidationError] = useState<string | null>(null);

  const [state, action, pending] = useActionState(signUpAction, initSignUp);

  const isEmail = !state.email;
  const isPassword = !isEmail && !state.password;

  const name = isEmail ? 'email' : isPassword ? 'password' : 'confirm';
  const type = isEmail ? 'text' : 'password';

  const label = isEmail
    ? 'Email'
    : isPassword
      ? 'Choose password'
      : 'Confirm password';

  const buttonLabel = pending
    ? 'Submitting...'
    : isEmail
      ? 'Continue with email'
      : isPassword
        ? 'Next'
        : 'Sign up';

  const defaultValue = isEmail
    ? persistedValuesRef.current.email
    : isPassword
      ? persistedValuesRef.current.password
      : persistedValuesRef.current.confirm;

  const onUnmountEffects = () => () => {
    toast.dismiss();
    inputRef.current = null;
    timeoutRef.current = null;
  };

  const onErrorEffects = () => {
    persistedValuesRef.current = { ...state };

    const { validationError, apiErrors } = state;

    if (validationError) setValidationError(validationError);
    if (apiErrors) apiErrors.forEach((message) => toast.error(message));

    inputRef.current?.focus();
  };

  const onSuccessEffects = () => {
    if (state.user) {
      toast.success(`Welcome to the club, ${state.user.email}!`);
      timeoutRef.current = setTimeout(() => {
        toast.dismiss();
        redirect('/form-alt');
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  };

  const handleResetErrorOnInput = () => {
    toast.dismiss();
    if (validationError) setValidationError(null);
  };

  const handleBackButtonAction = async (formData: FormData) => {
    toast.dismiss();
    setValidationError(null);

    formData.set('back', isPassword ? 'email' : 'password');
    action(formData);
  };

  useEffect(onErrorEffects, [state]);
  useEffect(onSuccessEffects, [state]);
  useEffect(onUnmountEffects, []);

  return (
    <Form className="flex h-full flex-col items-center gap-8" action={action}>
      <FormTitle title="Sign up" />
      <FormInput
        key={state.user?.email}
        ref={inputRef}
        name={name}
        type={type}
        label={label}
        defaultValue={defaultValue}
        onValueChange={handleResetErrorOnInput}
        isInvalid={!!validationError}
        errorMessage={validationError}
      />

      <div className="flex w-full flex-row-reverse gap-5">
        <SubmitButton label={buttonLabel} isDisabled={!!validationError} />
        {!isEmail && (
          <BackButton label="<" formAction={handleBackButtonAction} />
        )}
      </div>
      <HaveAnAccount />
    </Form>
  );
}
