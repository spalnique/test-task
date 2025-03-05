import { Button, ButtonProps } from '@heroui/react';

type Props = ButtonProps & { label: string };

export default function SubmitButton({ label, ...props }: Props) {
  return (
    <Button
      type="submit"
      variant="solid"
      className="h-10 w-full bg-[#0070f0] text-white disabled:bg-slate-600"
      {...props}
    >
      {label}
    </Button>
  );
}
