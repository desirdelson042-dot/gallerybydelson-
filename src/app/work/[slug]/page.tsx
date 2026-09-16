import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";

type Project = Tables<"projects">;

async function getProject(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  // No explicit status filter: RLS returns published-only rows to anonymous
  // visitors, and lets a logged-in admin preview drafts too.
  const { data } = await supabase.from("projects").select("*").eq("slug", slug).single();
  return data;
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

function isDirectVideoFile(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: project.seo_title || project.title,
    description: project.seo_description || project.description || undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const supabase = await createClient();
  const { data: media } = await supabase
    .from("project_media")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order");

  const meta: { label: string; value: string }[] = [
    { label: "Category", value: project.category },
    { label: "Client", value: project.client },
    { label: "Role", value: project.role },
    { label: "Year", value: project.year },
  ].filter((m) => m.value);

  const embedUrl = project.video_url ? toEmbedUrl(project.video_url) : null;

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-5xl px-6 py-24">
          {project.cover_image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <h1 className="mt-10 text-4xl font-semibold tracking-tight">{project.title}</h1>

          {(meta.length > 0 || (project.services && project.services.length > 0)) && (
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-t border-neutral-100 pt-6 text-sm">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-neutral-400">{m.label}</dt>
                  <dd className="mt-0.5 text-neutral-700">{m.value}</dd>
                </div>
              ))}
              {project.services && project.services.length > 0 && (
                <div>
                  <dt className="text-neutral-400">Services</dt>
                  <dd className="mt-0.5 text-neutral-700">{project.services.join(", ")}</dd>
                </div>
              )}
            </dl>
          )}

          {project.description && (
            <p className="mt-8 max-w-3xl whitespace-pre-line text-neutral-600">
              {project.description}
            </p>
          )}

          {project.external_url && (
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Visit project ↗
            </a>
          )}

          {project.video_url && (
            <div className="mt-12">
              {embedUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-neutral-100">
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : isDirectVideoFile(project.video_url) ? (
                <video
                  src={project.video_url}
                  controls
                  className="w-full rounded-2xl bg-neutral-100"
                />
              ) : (
                <a
                  href={project.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Watch video ↗
                </a>
              )}
            </div>
          )}

          {media && media.length > 0 && (
            <div className="mt-16 grid gap-6 sm:grid-cols-2">
              {media.map((item) => (
                <figure key={item.id} className="space-y-2">
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-100">
                    {item.media_type === "video" ? (
                      <video src={item.url} controls className="h-full w-full object-cover" />
                    ) : (
                      <Image
                        src={item.url}
                        alt={item.alt_text || project.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  {item.caption && (
                    <figcaption className="text-sm text-neutral-400">{item.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
