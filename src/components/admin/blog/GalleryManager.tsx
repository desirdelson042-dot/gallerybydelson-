"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SortableList } from "@/components/ui/SortableList";
import { ImagePicker } from "@/components/admin/ImagePicker";

export type GalleryEntry = { url: string; alt: string; caption: string };
type GalleryItem = GalleryEntry & { id: string };

function withIds(value: GalleryEntry[]): GalleryItem[] {
  return value.map((item) => ({ ...item, id: crypto.randomUUID() }));
}

function stripIds(items: GalleryItem[]): GalleryEntry[] {
  return items.map(({ url, alt, caption }) => ({ url, alt, caption }));
}

export function GalleryManager({
  value,
  onChange,
}: {
  value: GalleryEntry[];
  onChange: (value: GalleryEntry[]) => void;
}) {
  const [items, setItems] = useState<GalleryItem[]>(() => withIds(value));

  function update(next: GalleryItem[]) {
    setItems(next);
    onChange(stripIds(next));
  }

  function addImage(url: string) {
    update([...items, { id: crypto.randomUUID(), url, alt: "", caption: "" }]);
  }

  function updateItem(id: string, fields: Partial<GalleryEntry>) {
    update(items.map((i) => (i.id === id ? { ...i, ...fields } : i)));
  }

  function removeItem(id: string) {
    update(items.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-3">
      {items.length > 0 && (
        <SortableList
          items={items}
          onReorder={update}
          renderItem={(item) => (
            <div className="flex gap-3 rounded-md border border-neutral-200 p-3">
              <div className="w-28 shrink-0">
                <ImagePicker
                  value={item.url}
                  onChange={(url) => updateItem(item.id, { url })}
                  label="Choose image"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Alt text"
                  value={item.alt}
                  onChange={(e) => updateItem(item.id, { alt: e.target.value })}
                />
                <Input
                  placeholder="Caption"
                  value={item.caption}
                  onChange={(e) => updateItem(item.id, { caption: e.target.value })}
                />
              </div>
              <Button variant="danger" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </div>
          )}
        />
      )}
      <ImagePicker value={null} onChange={addImage} label="+ Add image" />
    </div>
  );
}
