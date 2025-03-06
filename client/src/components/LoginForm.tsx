import { signInAction } from '@/app/actions/auth';
import { initSignIn } from '@/constants/auth';
import { signOutUser } from '@/lib/api/auth/auth.api';
import { Form } from '@heroui/react';
import { useActionState, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import BackButton from './BackButton';
import FormInput from './FormInput';
import FormTitle from './FormTitle';
import HaveAnAccount from './HaveAnAccount';
import SubmitButton from './SubmitButton';

export default function LoginForm() {
  const user = localStorage.getItem('user');
  const persistedValuesRef = useRef(initSignIn);
  const inputRef = useRef<HTMLInputElement>(null);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(!!user);

  const [state, action, pending] = useActionState(signInAction, initSignIn);

  const isEmail = !state.email;

  const name = isEmail ? 'email' : 'password';
  const type = isEmail ? 'email' : 'password';
  const label = isEmail ? 'Email' : 'Password';

  const buttonLabel = pending ? 'Submitting...' : isEmail ? 'Next' : 'Sign in';

  const defaultValue = isEmail
    ? persistedValuesRef.current.email
    : persistedValuesRef.current.password;

  const onUnmountEffects = () => () => {
    toast.dismiss();
    inputRef.current = null;
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
      localStorage.setItem('user', state.user.email);
      toast.success(`Welcome back, ${state.user.email}!`);
    }
  };

  const handleResetErrorOnInput = () => {
    toast.dismiss();
    if (validationError) setValidationError(null);
  };

  const handleBackButtonAction = (formData: FormData) => {
    setValidationError(null);
    formData.set('back', 'email');
    action(formData);
  };

  const handleLogoutButton = () => {
    signOutUser();
    localStorage.removeItem('user');
    setIsAuth(false);
  };

  useEffect(onErrorEffects, [state]);
  useEffect(onSuccessEffects, [state]);
  useEffect(onUnmountEffects, []);

  return (
    <>
      {!isAuth ? (
        <Form
          className="flex h-full flex-col items-center gap-8"
          action={action}
        >
          <FormTitle title="Sign in" />
          <FormInput
            key={defaultValue}
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
      ) : (
        <SubmitButton label="Sign out" onPress={handleLogoutButton} />
      )}
    </>
  );
}
