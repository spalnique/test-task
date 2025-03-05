import { useSearchParams } from 'next/navigation';
import { ComponentPropsWithRef } from 'react';

import StyledLink from './StyledLink';

type Props = ComponentPropsWithRef<'div'>;

export default function HaveAnAccount(props: Props) {
  const searchParams = useSearchParams();
  const isRegister = searchParams.has('signup');

  const href = isRegister ? '/form-alt' : '/form-alt?signup';
  const label = isRegister ? 'Sign in' : 'Sign up';
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
