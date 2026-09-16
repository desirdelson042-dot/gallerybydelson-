import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export async function Live() {
  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("live_sessions")
    .select("*")
    .order("sort_order");

  if (!sessions || sessions.length === 0) return null;

  const liveNow = sessions.find((s) => s.status === "live");

  const now = Date.now();
  const upcoming = sessions
    .filter((s) => s.status === "scheduled" && s.scheduled_at && new Date(s.scheduled_at).getTime() > now)
    .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())[0];

  const replays = sessions.filter((s) => s.is_replay && s.replay_url);

  if (!liveNow && !upcoming && replays.length === 0) return null;

  return (
    <section id="live" className="mx-auto max-w-6xl px-6 py-24">
      <p className="text-sm uppercase tracking-wide text-neutral-400">Broadcast</p>
      <h2 className="mt-2 text-3xl font-semibold">My Live</h2>

      {liveNow && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 md:flex">
          {liveNow.thumbnail_url && (
            <div className="relative aspect-video w-full shrink-0 md:w-80">
              <Image src={liveNow.thumbnail_url} alt={liveNow.title} fill unoptimized className="object-cover" />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-center p-8">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-red-500">Live now</span>
            </div>
            <h3 className="mt-3 text-2xl font-semibold">{liveNow.title}</h3>
            {liveNow.description && (
              <p className="mt-2 max-w-xl text-neutral-600">{liveNow.description}</p>
            )}
            {liveNow.stream_url && (
              <a
                href={liveNow.stream_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
              >
                Watch now
              </a>
            )}
          </div>
        </div>
      )}

      {!liveNow && upcoming && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 md:flex">
          {upcoming.thumbnail_url && (
            <div className="relative aspect-video w-full shrink-0 md:w-80">
              <Image src={upcoming.thumbnail_url} alt={upcoming.title} fill unoptimized className="object-cover" />
            </div>
          )}
          <div className="flex flex-1 flex-col justify-center p-8">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Upcoming</span>
            <h3 className="mt-3 text-2xl font-semibold">{upcoming.title}</h3>
            {upcoming.description && (
              <p className="mt-2 max-w-xl text-neutral-600">{upcoming.description}</p>
            )}
            <p className="mt-4 text-sm text-neutral-500">
              {new Date(upcoming.scheduled_at!).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      )}

      {replays.length > 0 && (
        <div className="mt-16">
          <h3 className="text-lg font-semibold">Replays</h3>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {replays.map((session) => (
              <a
                key={session.id}
                href={session.replay_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-2xl border border-neutral-200 transition hover:border-neutral-300"
              >
                <div className="relative aspect-video w-full bg-neutral-100">
                  {session.thumbnail_url && (
                    <Image
                      src={session.thumbnail_url}
                      alt={session.title}
                      fill
                      unoptimized
                      className="object-cover transition group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium">{session.title}</p>
                  {session.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{session.description}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
