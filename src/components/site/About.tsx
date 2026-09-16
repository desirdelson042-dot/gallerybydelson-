import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export async function About() {
  const supabase = await createClient();
  const [{ data: content }, { data: skills }, { data: stats }, { data: blocks }] =
    await Promise.all([
      supabase.from("about_content").select("*").eq("id", 1).single(),
      supabase.from("about_skills").select("*").order("sort_order"),
      supabase.from("about_stats").select("*").order("sort_order"),
      supabase.from("about_blocks").select("*").eq("visible", true).order("sort_order"),
    ]);

  if (!content) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-[280px_1fr]">
        {content.profile_image_url && (
          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl bg-neutral-100">
            <Image src={content.profile_image_url} alt={content.name} fill unoptimized className="object-cover" />
          </div>
        )}
        <div>
          {content.short_intro && <p className="text-sm uppercase tracking-wide text-neutral-400">{content.short_intro}</p>}
          <h2 className="mt-2 text-3xl font-semibold">{content.name}</h2>
          {content.title && <p className="mt-1 text-neutral-500">{content.title}</p>}
          {content.biography && (
            <p className="mt-6 max-w-2xl whitespace-pre-line text-neutral-600">{content.biography}</p>
          )}
          {content.personal_statement && (
            <p className="mt-4 max-w-2xl text-neutral-500 italic">{content.personal_statement}</p>
          )}

          {skills && skills.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600">
                  {s.label}
                </span>
              ))}
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.id}>
                  <p className="text-2xl font-semibold">{s.value}</p>
                  <p className="text-xs text-neutral-400">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {content.cta_text && (
            <a
              href={content.cta_url || "#"}
              className="mt-8 inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              {content.cta_text}
            </a>
          )}

          {blocks && blocks.length > 0 && (
            <div className="mt-12 space-y-8">
              {blocks.map((b) => (
                <div key={b.id}>
                  {b.heading && <h3 className="text-lg font-semibold">{b.heading}</h3>}
                  {b.body && <p className="mt-2 whitespace-pre-line text-neutral-600">{b.body}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
