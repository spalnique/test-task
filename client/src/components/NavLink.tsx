'use client';

import { NavRoute } from '@/types/route.type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentPropsWithoutRef } from 'react';

type Props = ComponentPropsWithoutRef<'a'> & NavRoute;

export default function NavLink({ label, path, ...props }: Props) {
  const pathname = usePathname();

  const isActive = pathname.endsWith(path);
  const isAudio = pathname.endsWith('audio');

  return (
    <Link
      href={`${path}`}
      className={`${isActive ? (isAudio ? 'text-[#FF6EFD]' : 'text-[#5DDFFF]') : 'text-white'}`}
      {...props}
    >
      {label}
    </Link>
  );
}
