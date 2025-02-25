import { routes } from '@/constants/routes';
import { ComponentPropsWithoutRef } from 'react';

import NavLink from './NavLink';

type Props = ComponentPropsWithoutRef<'nav'>;

export default function Navigation(props: Props) {
  return (
    <nav
      {...props}
      className="isolate mx-auto flex h-[33px] w-[300px] items-center justify-center rounded-[10px] bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF]"
    >
      <ul className="border-1.5 flex h-full w-full items-center justify-center gap-[1.5px] overflow-hidden rounded-[10px] border-transparent">
        {routes.map((route) => (
          <li
            key={route.label}
            className="flex h-full grow items-center justify-center bg-[#121212]"
          >
            <NavLink {...route} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
