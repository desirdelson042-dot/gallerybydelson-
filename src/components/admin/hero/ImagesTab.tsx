"use client";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { SortableList } from "@/components/ui/SortableList";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import type { HeroImage } from "@/components/site/Hero";

export function ImagesTab({
  images,
  setImages,
}: {
  images: HeroImage[];
  setImages: React.Dispatch<React.SetStateAction<HeroImage[]>>;
}) {
  const supabase = createClient();
  const confirm = useConfirm();

  async function addImage(url: string) {
    const { data, error } = await supabase
      .from("hero_images")
      .insert({ url, sort_order: images.length, is_primary: images.length === 0 })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setImages((prev) => [...prev, data]);
  }

  async function update(id: string, fields: Partial<HeroImage>) {
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, ...fields } : i)));
    await supabase.from("hero_images").update(fields).eq("id", id);
  }

  async function setPrimary(id: string) {
    setImages((prev) => prev.map((i) => ({ ...i, is_primary: i.id === id })));
    await supabase.from("hero_images").update({ is_primary: false }).neq("id", id);
    await supabase.from("hero_images").update({ is_primary: true }).eq("id", id);
  }

  async function remove(image: HeroImage) {
    const ok = await confirm({ title: "Delete this hero image?", confirmLabel: "Delete", danger: true });
    if (!ok) return;
    await supabase.from("hero_images").delete().eq("id", image.id);
    setImages((prev) => prev.filter((i) => i.id !== image.id));
  }

  async function persistOrder(items: HeroImage[]) {
    setImages(items);
    await Promise.all(
      items.map((img, i) => supabase.from("hero_images").update({ sort_order: i }).eq("id", img.id)),
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500">
        Add as many Hero images as you like. Mark one as primary — that&apos;s the one shown.
      </p>
      <SortableList
        items={images}
        onReorder={persistOrder}
        renderItem={(image) => (
          <div className="rounded-md border border-neutral-200 p-3">
            <div className="flex gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                <img src={image.url} alt={image.alt_text} className="h-full w-full object-cover" />
              </div>
              <div className="grid flex-1 grid-cols-2 gap-2">
                <Field label="Alt text">
                  <Input
                    defaultValue={image.alt_text}
                    onBlur={(e) => update(image.id, { alt_text: e.target.value })}
                  />
                </Field>
                <Field label="Caption">
                  <Input
                    defaultValue={image.caption}
                    onBlur={(e) => update(image.id, { caption: e.target.value })}
                  />
                </Field>
                <Field label="Position">
                  <Select
                    defaultValue={image.object_position}
                    onChange={(e) => update(image.id, { object_position: e.target.value })}
                  >
                    {["top", "center", "bottom", "left", "right"].map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Crop">
                  <Select
                    defaultValue={image.object_fit}
                    onChange={(e) => update(image.id, { object_fit: e.target.value })}
                  >
                    <option value="cover">Cover (crop to fill)</option>
                    <option value="contain">Contain (show full image)</option>
                  </Select>
                </Field>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-neutral-500">
                <input
                  type="radio"
                  name="hero-primary"
                  checked={image.is_primary}
                  onChange={() => setPrimary(image.id)}
                />
                Primary / featured image
              </label>
              <Button variant="danger" onClick={() => remove(image)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      />
      <div>
        <ImagePicker value={null} onChange={addImage} label="+ Add hero image" />
      </div>
    </div>
  );
}
