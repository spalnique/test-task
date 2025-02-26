import { useSearchParams } from 'next/navigation';
import { ComponentPropsWithRef } from 'react';

import StyledLink from './StyledLink';

type Props = ComponentPropsWithRef<'div'>;

export default function HaveAnAccount(props: Props) {
  const searchParams = useSearchParams();
  const isRegister = searchParams.has('register');

  const href = isRegister ? '/form' : '/form?register';
  const label = isRegister ? 'Log in' : 'Register';
  const text = isRegister
    ? 'Already have an account? '
    : "Don't have an account? ";

  return (
    <div {...props}>
      <span>{text}</span>
      <StyledLink href={href} label={label} />
    </div>
  );
}
