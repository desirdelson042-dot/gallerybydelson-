import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">New project</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Fill in the details, then save to add gallery media.
        </p>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}
