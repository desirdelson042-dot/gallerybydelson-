import Link from "next/link";

export function PreviewBanner() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-amber-400 px-4 py-2 text-center text-xs font-medium text-amber-950">
      <span>Preview mode — you&apos;re seeing draft and hidden content that isn&apos;t public yet.</span>
      <Link href="/admin" className="underline underline-offset-2">
        Back to dashboard
      </Link>
    </div>
  );
}
