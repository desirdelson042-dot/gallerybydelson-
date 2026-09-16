import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("site_title").eq("id", 1).single();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/80 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {data?.site_title ?? "Portfolio"}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-500">
          <Link href="/work" className="hover:text-neutral-900">Work</Link>
          <Link href="/blog" className="hover:text-neutral-900">Blog</Link>
          <Link href="/#contact" className="hover:text-neutral-900">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
