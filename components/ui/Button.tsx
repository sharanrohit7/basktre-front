import Link from "next/link";

export default function Button({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-[7px] bg-[var(--ink)] px-3.5 py-2 text-[13.5px] font-medium text-white">
      {children}
    </Link>
  );
}
