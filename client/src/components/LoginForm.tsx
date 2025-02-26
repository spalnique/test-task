import { signin } from '@/app/actions/auth';
import { initSignIn } from '@/constants/forms';
import { emailPattern } from '@/constants/validation.regex';
import { Form } from '@heroui/react';
import { useActionState } from 'react';

import FormInput from './FormInput';
import FormTitle from './FormTitle';
import HaveAnAccount from './HaveAnAccount';
import SubmitButton from './SubmitButton';

export default function LoginForm() {
  const [state, action, pending] = useActionState(signin, initSignIn);

  const isEmail = !state.email;

  const buttonLabel = pending
    ? 'Submitting...'
    : isEmail
      ? 'Continue with email'
      : 'Sign in';

  return (
    <Form className="flex h-full flex-col items-center gap-10" action={action}>
      <FormTitle title="Sign in" />
      {isEmail ? (
        <FormInput
          name="email"
          type="email"
          label="Email"
          defaultValue={state.email}
          pattern={emailPattern}
          errorMessage="Email should be yourmail@example.com"
          isRequired
        />
      ) : (
        <FormInput
          name="password"
          type="password"
          label="Enter password"
          defaultValue={state.password}
          errorMessage="Password must have at least 8 characters"
          minLength={8}
          isRequired
        />
      )}
      <SubmitButton label={buttonLabel} />
      <HaveAnAccount />
    </Form>
  );
}
