import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'p'> & { response: string };

export default function ChatResponse({ response }: Props) {
  const chars = response.split('');
  const text = useTypingAnimation(chars);

  return (
    <p className="scroll-hide border-1 flex max-h-40 w-11/12 flex-col-reverse overflow-auto rounded-3xl border-[#622BD8] bg-[#121212] px-6 py-3 text-start text-sm text-slate-200">
      {text}
    </p>
  );
}
