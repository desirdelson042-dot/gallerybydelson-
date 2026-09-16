import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

export default async function AdminHome() {
  const supabase = await createClient();
  const [{ count: projects }, { count: posts }, { count: messages }, { count: unread }] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
    ]);

  const stats = [
    { label: "Projects", value: projects ?? 0, href: "/admin/projects" },
    { label: "Blog posts", value: posts ?? 0, href: "/admin/blog" },
    { label: "Messages", value: messages ?? 0, href: "/admin/messages" },
    { label: "Unread messages", value: unread ?? 0, href: "/admin/messages" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Everything on your site is editable from here — no code required.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition hover:border-neutral-300">
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="mt-1 text-xs text-neutral-500">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <h2 className="text-sm font-semibold">Quick links</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          <Link className="text-neutral-600 hover:text-neutral-900" href="/admin/hero">Edit Hero →</Link>
          <Link className="text-neutral-600 hover:text-neutral-900" href="/admin/sections">Reorder sections →</Link>
          <Link className="text-neutral-600 hover:text-neutral-900" href="/admin/projects">Add a project →</Link>
          <Link className="text-neutral-600 hover:text-neutral-900" href="/admin/social">Update social links →</Link>
          <Link className="text-neutral-600 hover:text-neutral-900" href="/admin/settings">Site settings →</Link>
        </div>
      </Card>
    </div>
  );
}
