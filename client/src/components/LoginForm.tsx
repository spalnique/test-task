import { signinAction } from '@/app/actions/auth';
import { initSignIn } from '@/constants/auth';
import { Form } from '@heroui/react';
import { useActionState, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import BackButton from './BackButton';
import FormInput from './FormInput';
import FormTitle from './FormTitle';
import HaveAnAccount from './HaveAnAccount';
import SubmitButton from './SubmitButton';

export default function LoginForm() {
  const defaultValuesRef = useRef(initSignIn);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(signinAction, initSignIn);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    defaultValuesRef.current = { ...state };

    if (state.error) setErrorMessage(state.error);

    inputRef.current?.focus();
  }, [state]);

  useEffect(() => {
    const { user, errors } = state.response;
    if (user) toast.success(`Welcome back, ${user.email}!`);
    if (errors) errors.forEach((message) => toast.error(message));
  }, [state]);

  const handleValueChange = () => {
    if (errorMessage) setErrorMessage(null);
  };

  const backAction = (formData: FormData) => {
    setErrorMessage(null);
    formData.set('back', 'email');
    action(formData);
  };

  const isEmail = !state.email;

  const buttonLabel = pending ? 'Submitting...' : isEmail ? 'Next' : 'Sign in';

  const name = isEmail ? 'email' : 'password';
  const type = isEmail ? 'email' : 'password';
  const label = isEmail ? 'Email' : 'Password';

  const defaultValue = isEmail
    ? defaultValuesRef.current.email
    : defaultValuesRef.current.password;

  return (
    <>
      {!state.response.user ? (
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
      ) : (
        <button>Logout</button>
      )}
    </>
  );
}
