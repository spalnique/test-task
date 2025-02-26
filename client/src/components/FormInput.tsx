import { Input, InputProps } from '@heroui/react';

type Props = InputProps;

export default function FormInput(props: Props) {
  return (
    <Input
      classNames={{
        inputWrapper:
          'bg-[#27272A] border-1 !border-[#0070f0] outline-none hover:outline-2 hover:outline-[#0070f0] focus-within:outline-[#0070f0] focus-withing:outline-2',
        helperWrapper: 'gap-0 p-0',
        errorMessage: 'absolute -bottom-[26px] left-[14px]',
        label: 'text-white',
      }}
      variant="bordered"
      labelPlacement="inside"
      isClearable
      autoFocus
      {...props}
    />
  );
}
