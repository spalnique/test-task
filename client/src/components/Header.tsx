import { ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'header'>;

export default function Header({ children }: Props) {
  return <header className="py-[8vh]">{children}</header>;
}
