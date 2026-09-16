"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SortableList } from "@/components/ui/SortableList";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

type Project = Tables<"projects">;

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    setProjects(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function persistOrder(items: Project[]) {
    setProjects(items);
    await Promise.all(
      items.map((p, i) => supabase.from("projects").update({ sort_order: i }).eq("id", p.id)),
    );
  }

  async function toggleFeatured(project: Project) {
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: !p.featured } : p)),
    );
    await supabase.from("projects").update({ featured: !project.featured }).eq("id", project.id);
  }

  async function togglePublish(project: Project) {
    const nextStatus = project.status === "published" ? "draft" : "published";
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, status: nextStatus } : p)),
    );
    await supabase.from("projects").update({ status: nextStatus }).eq("id", project.id);
    toast.success(nextStatus === "published" ? "Project published" : "Project unpublished");
  }

  async function duplicateProject(project: Project) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...rest } = project;
    const slug = `${project.slug}-copy-${Math.random().toString(36).slice(2, 8)}`;
    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...rest,
        slug,
        status: "draft",
        sort_order: projects.length,
      })
      .select()
      .single();
    if (error || !data) {
      toast.error(error?.message ?? "Could not duplicate project");
      return;
    }
    setProjects((prev) => [...prev, data]);
    toast.success("Project duplicated");
  }

  async function deleteProject(project: Project) {
    const ok = await confirm({
      title: `Delete "${project.title}"?`,
      description: "This also deletes its gallery media. This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("projects").delete().eq("id", project.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    toast.success("Project deleted");
  }

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Work / Projects</h1>
          <p className="mt-1 text-sm text-neutral-500">Drag to reorder how projects appear on the site.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button variant="primary">+ New project</Button>
        </Link>
      </div>

      <Card>
        {projects.length === 0 ? (
          <p className="text-sm text-neutral-400">No projects yet. Create your first one.</p>
        ) : (
          <SortableList
            items={projects}
            onReorder={persistOrder}
            renderItem={(project) => (
              <div className="flex items-center gap-3 rounded-md border border-neutral-200 p-3">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded bg-neutral-100">
                  {project.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{project.title}</p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        project.status === "published"
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-500",
                      )}
                    >
                      {project.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-neutral-400">
                    {[project.category, project.year].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFeatured(project)}
                  title={project.featured ? "Unfeature" : "Feature"}
                  className={cn(
                    "shrink-0 rounded p-1.5 text-lg leading-none transition hover:bg-neutral-100",
                    project.featured ? "text-amber-500" : "text-neutral-300",
                  )}
                >
                  {project.featured ? "★" : "☆"}
                </button>

                <div className="flex shrink-0 flex-wrap justify-end gap-2">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button variant="ghost" onClick={() => duplicateProject(project)}>
                    Duplicate
                  </Button>
                  <Button variant="ghost" onClick={() => togglePublish(project)}>
                    {project.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button variant="danger" onClick={() => deleteProject(project)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          />
        )}
      </Card>
    </div>
  );
}
