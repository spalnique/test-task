import { ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'p'> & { title: string };

export default function FormTitle({ title, ...props }: Props) {
  return (
    <p className="self-start text-xl capitalize" {...props}>
      {title}
    </p>
  );
}
