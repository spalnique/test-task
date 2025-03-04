import { ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'div'>;

export default function PageWrapper({ children, className }: Props) {
  return (
    <div
      className={`mx-auto flex max-h-[calc(84vh-30px)] flex-col bg-[#171717] ${className}`}
    >
      {children}
    </div>
  );
}
