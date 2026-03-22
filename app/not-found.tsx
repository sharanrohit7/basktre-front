import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="font-[var(--font-serif)] text-4xl">Page not found</h1>
      <p className="text-sm text-[var(--text-2)]">The page you requested does not exist.</p>
      <Link href="/" className="text-sm font-medium text-[var(--accent)] underline">
        Back to home
      </Link>
    </div>
  );
}
