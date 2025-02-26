import { signup } from '@/app/actions/auth';
import { initSignUp } from '@/constants/forms';
import { emailPattern } from '@/constants/validation.regex';
import { Form } from '@heroui/react';
import { useActionState } from 'react';

import FormInput from './FormInput';
import FormTitle from './FormTitle';
import HaveAnAccount from './HaveAnAccount';
import SubmitButton from './SubmitButton';

export default function RegisterForm() {
  const [state, action, pending] = useActionState(signup, initSignUp);

  const isEmail = !state.email;
  const isPassword = !isEmail && !state.password;
  const isConfirm = !isEmail && !isPassword;

  const buttonLabel = pending
    ? 'Submitting...'
    : isEmail
      ? 'Continue with email'
      : isPassword
        ? 'Confirm password'
        : 'Sign up';

  return (
    <Form className="flex h-full flex-col items-center gap-8" action={action}>
      <FormTitle title="Sign up" />
      {isEmail && (
        <FormInput
          name="email"
          type="email"
          label="Email"
          defaultValue={state.email}
          pattern={emailPattern}
          errorMessage="Email should be yourmail@example.com"
          isRequired
        />
      )}
      {isPassword && (
        <FormInput
          name="password"
          type="password"
          label="Enter password"
          defaultValue={state.password}
          minLength={8}
          errorMessage="Password should be at least 8 characters long"
          isRequired
        />
      )}
      {isConfirm && (
        <FormInput
          name="confirm"
          type="password"
          label="Confirm password"
          defaultValue={state.confirm}
          errorMessage={state.error}
          minLength={8}
          isRequired
        />
      )}

      <SubmitButton label={buttonLabel} />
      <HaveAnAccount />
    </Form>
  );
}
