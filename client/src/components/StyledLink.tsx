import Link from "next/link";
import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"a"> & {
  label: string;
  href: string;
  index?: boolean;
};

export default function StyledLink({ className, label, href, index }: Props) {
  return (
    <Link className={`text-[#0070f0] transition-all hover:text-[#0700f0] ${className}`} href={index ? "/" : href}>
      {label}
    </Link>
  );
}
