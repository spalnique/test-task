import { Button, ButtonProps } from '@heroui/react';

type Props = ButtonProps & { label: string };

export default function BackButton({ label, ...props }: Props) {
  return (
    <Button
      type="submit"
      variant="flat"
      size="sm"
      className="text-small border-1 flex size-10 min-w-0 items-center justify-center border-[#0070f0] bg-[#171717] text-[#0070f0] hover:bg-[#0070f0] hover:text-white"
      {...props}
    >
      {label}
    </Button>
  );
}
