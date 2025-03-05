import { signupAction } from '@/app/actions/auth';
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
  const defaultValues = useRef(initSignUp);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const [state, action, pending] = useActionState(signupAction, initSignUp);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    defaultValues.current = { ...state };

    if (state.error) setErrorMessage(state.error);

    inputRef.current?.focus();
  }, [state]);

  useEffect(() => {
    if (state.response.user) {
      toast.success('Welcome to the club!');
      timeoutRef.current = setTimeout(() => redirect('/form-alt'), 3000);
    }

    if (state.response.errors) {
      state.response.errors.forEach((message) => toast.error(message));
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state]);

  const handleValueChange = () => {
    if (errorMessage) setErrorMessage(null);
  };

  const backAction = async (formData: FormData) => {
    setErrorMessage(null);

    formData.set('back', isPassword ? 'email' : 'password');

    action(formData);
  };

  const isEmail = !state.email;
  const isPassword = !isEmail && !state.password;

  const buttonLabel = pending
    ? 'Submitting...'
    : isEmail
      ? 'Continue with email'
      : isPassword
        ? 'Next'
        : 'Sign up';

  const name = isEmail ? 'email' : isPassword ? 'password' : 'confirm';
  const type = isEmail ? 'text' : 'password';

  const label = isEmail
    ? 'Email'
    : isPassword
      ? 'Choose password'
      : 'Confirm password';

  const defaultValue = isEmail
    ? defaultValues.current.email
    : isPassword
      ? defaultValues.current.password
      : defaultValues.current.confirm;

  return (
    <Form className="flex h-full flex-col items-center gap-8" action={action}>
      <FormTitle title="Sign up" />
      <FormInput
        key={defaultValue}
        ref={inputRef}
        name={name}
        type={type}
        label={label}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        isInvalid={!!errorMessage}
        errorMessage={errorMessage}
      />

      <div className="flex w-full flex-row-reverse gap-5">
        <SubmitButton label={buttonLabel} isDisabled={!!errorMessage} />
        {!isEmail && <BackButton label="<" formAction={backAction} />}
      </div>
      <HaveAnAccount />
    </Form>
  );
}
