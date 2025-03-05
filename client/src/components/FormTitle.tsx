import { ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'p'> & { title: string };

export default function FormTitle({ title, className, ...props }: Props) {
  return (
    <p className={`text-xl capitalize ${className}`} {...props}>
      {title}
    </p>
  );
}
