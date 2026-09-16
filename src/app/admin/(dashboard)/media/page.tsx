"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia, deleteMedia } from "@/lib/media";
import type { Tables } from "@/lib/database.types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

type MediaItem = Tables<"media_library">;

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const confirm = useConfirm();
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const item = await uploadMedia(file);
        setItems((prev) => [item, ...prev]);
      }
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: MediaItem) {
    const ok = await confirm({
      title: "Delete this media file?",
      description: "It will be removed from storage. Anything referencing it will show a broken image.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    await deleteMedia(item.id, item.storage_path);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setSelected(null);
    toast.success("Deleted");
  }

  async function updateMeta(item: MediaItem, fields: Partial<MediaItem>) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...fields } : i)));
    setSelected((prev) => (prev && prev.id === item.id ? { ...prev, ...fields } : prev));
    await supabase.from("media_library").update(fields).eq("id", item.id);
  }

  const filtered = items.filter((i) =>
    (i.filename + " " + i.alt_text + " " + i.caption).toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Media library</h1>
          <p className="mt-1 text-sm text-neutral-500">Every image and video you&apos;ve uploaded, in one place.</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        <Button variant="primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading…" : "Upload files"}
        </Button>
      </div>

      <Input placeholder="Search media…" value={search} onChange={(e) => setSearch(e.target.value)} />

      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-400">No media yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="aspect-square overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 transition hover:ring-2 hover:ring-neutral-900"
            >
              {item.media_type === "video" ? (
                <video src={item.url} className="h-full w-full object-cover" muted />
              ) : (
                <img src={item.url} alt={item.alt_text} className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Media details</h3>
              <button onClick={() => setSelected(null)} className="text-neutral-400 hover:text-neutral-700">
                ✕
              </button>
            </div>
            <div className="mt-4 aspect-video overflow-hidden rounded-md bg-neutral-50">
              {selected.media_type === "video" ? (
                <video src={selected.url} controls className="h-full w-full object-contain" />
              ) : (
                <img src={selected.url} alt={selected.alt_text} className="h-full w-full object-contain" />
              )}
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-600">Alt text</label>
                <Input
                  defaultValue={selected.alt_text}
                  onBlur={(e) => updateMeta(selected, { alt_text: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Caption</label>
                <Input
                  defaultValue={selected.caption}
                  onBlur={(e) => updateMeta(selected, { caption: e.target.value })}
                />
              </div>
              <p className="text-xs text-neutral-400 break-all">{selected.url}</p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="danger" onClick={() => handleDelete(selected)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
