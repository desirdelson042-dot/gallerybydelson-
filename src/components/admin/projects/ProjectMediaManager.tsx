"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { SortableList } from "@/components/ui/SortableList";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useConfirm } from "@/components/ui/ConfirmDialog";

type ProjectMedia = Tables<"project_media">;

export function ProjectMediaManager({ projectId }: { projectId: string }) {
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();
  const supabase = createClient();

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("project_media")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order");
      if (active) {
        setMedia(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function addMedia(url: string, mediaType: "image" | "video") {
    const { data, error } = await supabase
      .from("project_media")
      .insert({
        project_id: projectId,
        media_type: mediaType,
        url,
        sort_order: media.length,
      })
      .select()
      .single();
    if (error || !data) {
      toast.error(error?.message ?? "Could not add media");
      return;
    }
    setMedia((prev) => [...prev, data]);
    toast.success("Media added");
  }

  async function updateItem(item: ProjectMedia, fields: Partial<ProjectMedia>) {
    setMedia((prev) => prev.map((m) => (m.id === item.id ? { ...m, ...fields } : m)));
    const { error } = await supabase.from("project_media").update(fields).eq("id", item.id);
    if (error) toast.error(error.message);
  }

  async function removeItem(item: ProjectMedia) {
    const ok = await confirm({
      title: "Remove this media item?",
      description: "This cannot be undone.",
      confirmLabel: "Remove",
      danger: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("project_media").delete().eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setMedia((prev) => prev.filter((m) => m.id !== item.id));
  }

  async function reorder(items: ProjectMedia[]) {
    setMedia(items);
    await Promise.all(
      items.map((m, i) => supabase.from("project_media").update({ sort_order: i }).eq("id", m.id)),
    );
  }

  if (loading) return null;

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold">Gallery media</h2>
        <p className="mt-1 text-xs text-neutral-400">Drag to reorder. Shown on the project&apos;s detail page.</p>
      </div>

      {media.length > 0 && (
        <SortableList
          items={media}
          onReorder={reorder}
          renderItem={(item) => (
            <div className="flex gap-3 rounded-md border border-neutral-200 p-3">
              <div className="w-32 shrink-0">
                <ImagePicker
                  value={item.url}
                  onChange={(url) => updateItem(item, { url })}
                  accept="all"
                  label="Choose file"
                />
              </div>
              <div className="grid flex-1 grid-cols-2 gap-3">
                <Field label="Alt text" className="col-span-2">
                  <Input
                    defaultValue={item.alt_text}
                    onBlur={(e) => updateItem(item, { alt_text: e.target.value })}
                  />
                </Field>
                <Field label="Caption">
                  <Input
                    defaultValue={item.caption}
                    onBlur={(e) => updateItem(item, { caption: e.target.value })}
                  />
                </Field>
                <Field label="Type">
                  <Select
                    value={item.media_type}
                    onChange={(e) => updateItem(item, { media_type: e.target.value })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </Select>
                </Field>
                <div className="col-span-2 flex justify-end">
                  <Button variant="danger" onClick={() => removeItem(item)}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          )}
        />
      )}

      <div className="flex gap-2 border-t border-neutral-100 pt-4">
        <div>
          <p className="mb-1.5 text-xs font-medium text-neutral-600">+ Add image</p>
          <ImagePicker value={null} onChange={(url) => addMedia(url, "image")} accept="image" label="+ Add image" />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-neutral-600">+ Add video</p>
          <ImagePicker value={null} onChange={(url) => addMedia(url, "video")} accept="video" label="+ Add video" />
        </div>
      </div>
    </Card>
  );
}
