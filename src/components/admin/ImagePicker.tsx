"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/media";
import type { Tables } from "@/lib/database.types";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type MediaItem = Tables<"media_library">;

export function ImagePicker({
  value,
  onChange,
  accept = "image",
  label = "Choose image",
}: {
  value: string | null | undefined;
  onChange: (url: string) => void;
  accept?: "image" | "video" | "all";
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {value ? (
        <div className="group relative aspect-video w-full max-w-xs overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
          {accept === "video" ? (
            <video src={value} className="h-full w-full object-cover" muted />
          ) : (
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute inset-0 hidden items-center justify-center bg-black/40 text-xs font-medium text-white group-hover:flex"
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex aspect-video w-full max-w-xs items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400 hover:border-neutral-400 hover:text-neutral-600"
        >
          {label}
        </button>
      )}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-neutral-400 hover:text-red-500"
        >
          Remove
        </button>
      )}
      {open && (
        <MediaModal
          accept={accept}
          onClose={() => setOpen(false)}
          onSelect={(url) => {
            onChange(url);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function MediaModal({
  accept,
  onClose,
  onSelect,
}: {
  accept: "image" | "video" | "all";
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const supabase = createClient();
      let query = supabase.from("media_library").select("*").order("created_at", { ascending: false });
      if (accept !== "all") query = query.eq("media_type", accept);
      const { data } = await query;
      if (active) {
        setItems(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [accept]);

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

  const filtered = items.filter((i) =>
    (i.filename + " " + i.alt_text).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex h-[80vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h3 className="text-sm font-semibold">Media library</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            ✕
          </button>
        </div>
        <div className="flex items-center gap-2 border-b border-neutral-200 p-4">
          <input
            placeholder="Search media…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border border-neutral-200 px-3 py-1.5 text-sm outline-none focus:border-neutral-400"
          />
          <input
            ref={fileRef}
            type="file"
            multiple
            accept={accept === "all" ? undefined : `${accept}/*`}
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button variant="primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-neutral-400">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-neutral-400">No media yet. Upload something above.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.url)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 transition hover:ring-2 hover:ring-neutral-900",
                  )}
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
        </div>
      </div>
    </div>
  );
}
