import { ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'li'> & { text: string };

export default function MessageListItem({ text }: Props) {
  return (
    <li className="w-11/12 border-b-[0.5px] border-b-slate-500 py-4 first:border-b-0">
      <p className="whitespace-pre-line text-sm text-slate-200">{text}</p>
    </li>
  );
}
