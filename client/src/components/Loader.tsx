import { Spinner } from '@heroui/react';

export default function Loader() {
  return (
    <>
      <div className="absolute left-0 top-0 z-[1] h-full w-full rounded-lg bg-black opacity-80"></div>
      <div className="absolute left-1/2 top-1/2 z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-3">
        <Spinner size="lg" />
        <span className="text-blue-50">Loading...</span>
      </div>
    </>
  );
}
