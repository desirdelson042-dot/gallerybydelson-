"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { toSlug } from "@/lib/slug";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { ImagePicker } from "@/components/admin/ImagePicker";

type Project = Tables<"projects">;

type FormState = {
  title: string;
  slug: string;
  description: string;
  category: string;
  year: string;
  client: string;
  role: string;
  services: string;
  cover_image_url: string;
  video_url: string;
  external_url: string;
  seo_title: string;
  seo_description: string;
  status: string;
  featured: boolean;
};

function toFormState(project?: Project): FormState {
  return {
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    description: project?.description ?? "",
    category: project?.category ?? "",
    year: project?.year ?? "",
    client: project?.client ?? "",
    role: project?.role ?? "",
    services: project?.services?.join(", ") ?? "",
    cover_image_url: project?.cover_image_url ?? "",
    video_url: project?.video_url ?? "",
    external_url: project?.external_url ?? "",
    seo_title: project?.seo_title ?? "",
    seo_description: project?.seo_description ?? "",
    status: project?.status ?? "draft",
    featured: project?.featured ?? false,
  };
}

export function ProjectForm({
  mode,
  initialProject,
}: {
  mode: "create" | "edit";
  initialProject?: Project;
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialProject));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function patch(fields: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...fields }));
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: !slugTouched || prev.slug === "" ? toSlug(value) : prev.slug,
    }));
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    patch({ slug: value });
  }

  function servicesArray() {
    return form.services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function buildPayload() {
    return {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      description: form.description,
      category: form.category,
      year: form.year,
      client: form.client,
      role: form.role,
      services: servicesArray(),
      cover_image_url: form.cover_image_url || null,
      video_url: form.video_url || null,
      external_url: form.external_url || null,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      status: form.status,
      featured: form.featured,
    };
  }

  function reportError(error: { code?: string; message: string }) {
    if (error.code === "23505") {
      toast.error("That slug is already taken — try another.");
      return;
    }
    toast.error(error.message);
  }

  async function handleCreate() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("projects")
      .insert(buildPayload())
      .select()
      .single();
    setSaving(false);
    if (error || !data) {
      reportError(error ?? { message: "Could not create project" });
      return;
    }
    toast.success("Project created");
    router.push(`/admin/projects/${data.id}`);
  }

  async function handleSave() {
    if (!initialProject) return;
    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update(buildPayload())
      .eq("id", initialProject.id);
    setSaving(false);
    if (error) {
      reportError(error);
      return;
    }
    toast.success("Project saved");
  }

  return (
    <Card className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title">
          <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
        </Field>
        <Field label="Slug" hint="Used in the project URL: /work/your-slug">
          <Input value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} />
        </Field>
      </div>

      <Field label="Description">
        <Textarea
          className="min-h-32"
          value={form.description}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Cover image">
          <ImagePicker
            value={form.cover_image_url}
            onChange={(v) => patch({ cover_image_url: v })}
            accept="image"
          />
        </Field>
        <div className="space-y-4">
          <Field label="Video URL" hint="YouTube, Vimeo, or a direct video link">
            <Input value={form.video_url} onChange={(e) => patch({ video_url: e.target.value })} />
          </Field>
          <Field label="External URL">
            <Input value={form.external_url} onChange={(e) => patch({ external_url: e.target.value })} />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <Input value={form.category} onChange={(e) => patch({ category: e.target.value })} />
        </Field>
        <Field label="Year">
          <Input value={form.year} onChange={(e) => patch({ year: e.target.value })} />
        </Field>
        <Field label="Client">
          <Input value={form.client} onChange={(e) => patch({ client: e.target.value })} />
        </Field>
        <Field label="Role">
          <Input value={form.role} onChange={(e) => patch({ role: e.target.value })} />
        </Field>
      </div>

      <Field label="Services" hint="Comma-separated, e.g. Branding, Web design, Development">
        <Input value={form.services} onChange={(e) => patch({ services: e.target.value })} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="SEO title">
          <Input value={form.seo_title} onChange={(e) => patch({ seo_title: e.target.value })} />
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={(e) => patch({ status: e.target.value })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </Field>
      </div>

      <Field label="SEO description">
        <Textarea
          value={form.seo_description}
          onChange={(e) => patch({ seo_description: e.target.value })}
        />
      </Field>

      <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
        <Switch checked={form.featured} onChange={(v) => patch({ featured: v })} label="Featured" />
        {mode === "create" ? (
          <Button variant="primary" onClick={handleCreate} disabled={saving}>
            {saving ? "Creating…" : "Create project"}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        )}
      </div>
    </Card>
  );
}
