import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { Message } from '@/types/chat.type';
import { ComponentPropsWithRef } from 'react';

import MessageListItem from './MessageListItem';

type Props = ComponentPropsWithRef<'p'> & { responses: Message[] };

export default function MessageList({ responses }: Props) {
  const [{ text }] = responses;
  const smooth = useTypingAnimation(text);

  return (
    <ul className="scrollbar-hide flex h-40 w-full flex-col-reverse items-center overflow-auto text-wrap rounded-3xl border border-[#622BD8] bg-[#121212]">
      {responses.map(({ id, text }, i) => (
        <MessageListItem key={id} text={i ? text : smooth} />
      ))}
    </ul>
  );
}
