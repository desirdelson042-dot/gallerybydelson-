import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";

export type Project = Tables<"projects">;

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-neutral-100">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-neutral-900">{project.title}</h3>
        <p className="mt-1 text-sm text-neutral-400">
          {[project.category, project.year].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

export async function Work() {
  const supabase = await createClient();

  const { data: featured } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .eq("featured", true)
    .order("sort_order")
    .limit(6);

  let projects = featured ?? [];

  if (projects.length === 0) {
    const { data: recent } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6);
    projects = recent ?? [];
  }

  if (projects.length === 0) return null;

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-3xl font-semibold">Work</h2>
      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/work" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
          View all work →
        </Link>
      </div>
    </section>
  );
}
