'use client';

import { HeroUIProvider } from '@heroui/react';
import { PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
export default Providers;
