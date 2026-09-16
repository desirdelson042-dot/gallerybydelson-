import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatMonthYear } from "@/lib/utils";

export async function Experience() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order");

  if (!entries || entries.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-24">
      <h2 className="text-3xl font-semibold">Experience</h2>

      <div className="mt-12 space-y-10">
        {entries.map((entry) => {
          const range = entry.start_date
            ? `${formatMonthYear(entry.start_date)} — ${entry.is_current ? "Present" : formatMonthYear(entry.end_date)}`
            : entry.is_current
              ? "Present"
              : "";

          return (
            <div key={entry.id} className="flex gap-5">
              {entry.logo_url ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                  <Image src={entry.logo_url} alt={entry.company} fill unoptimized className="object-cover" />
                </div>
              ) : (
                <div className="h-12 w-12 shrink-0 rounded-full bg-neutral-100" />
              )}

              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-base font-semibold">
                    {entry.position}
                    {entry.position && entry.company && " · "}
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:text-neutral-600"
                      >
                        {entry.company}
                      </a>
                    ) : (
                      entry.company
                    )}
                  </h3>
                  {range && <span className="text-xs text-neutral-400">{range}</span>}
                </div>
                {entry.description && (
                  <p className="mt-2 whitespace-pre-line text-sm text-neutral-500">{entry.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
