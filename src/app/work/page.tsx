import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProjectCard } from "@/components/site/Work";
import { createClient } from "@/lib/supabase/server";
import { isPreviewViewer } from "@/lib/preview";

export const metadata: Metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const supabase = await createClient();
  const preview = await isPreviewViewer();

  // No explicit status filter: RLS returns only published rows to anonymous
  // visitors, and every row (including drafts) to a logged-in admin.
  const { data: projects } = await supabase.from("projects").select("*").order("sort_order");

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24">
          <h1 className="text-4xl font-semibold tracking-tight">Work</h1>
          <p className="mt-2 max-w-xl text-neutral-500">A selection of recent projects.</p>

          {projects && projects.length > 0 ? (
            <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div key={project.id} className="relative">
                  {preview && project.status !== "published" && (
                    <span className="absolute -top-2 left-0 z-10 rounded bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white">
                      Draft
                    </span>
                  )}
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-14 text-sm text-neutral-400">No projects yet.</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
