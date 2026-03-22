import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] px-12 py-8">
      <span className="text-[13px] text-[var(--text-3)]">© 2026 Basktre · Beta</span>
      <div className="flex gap-6">
        <Link href="/about" className="text-[13px] text-[var(--text-3)]">
          About
        </Link>
        <Link href="/privacy" className="text-[13px] text-[var(--text-3)]">
          Privacy
        </Link>
        <Link href="/terms" className="text-[13px] text-[var(--text-3)]">
          Terms
        </Link>
      </div>
    </footer>
  );
}
