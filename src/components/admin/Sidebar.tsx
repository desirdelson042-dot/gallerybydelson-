"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/sections", label: "Sections" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/projects", label: "Work / Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/live", label: "My Live" },
  { href: "/admin/social", label: "Social Media" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 p-4">
        <p className="text-sm font-semibold">Admin Dashboard</p>
        <Link href="/" target="_blank" className="text-xs text-neutral-400 hover:text-neutral-700">
          View site ↗
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-neutral-200 p-3">
        <button
          onClick={signOut}
          className="w-full rounded-md px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
