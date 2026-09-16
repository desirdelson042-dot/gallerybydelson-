import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { ProjectMediaManager } from "@/components/admin/projects/ProjectMediaManager";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Edit project</h1>
        <p className="mt-1 text-sm text-neutral-500">{project.title}</p>
      </div>
      <ProjectForm mode="edit" initialProject={project} />
      <ProjectMediaManager projectId={project.id} />
    </div>
  );
}
