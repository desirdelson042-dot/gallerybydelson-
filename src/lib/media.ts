import { createClient } from "@/lib/supabase/client";

function extOf(filename: string) {
  const match = filename.match(/\.[a-zA-Z0-9]+$/);
  return match ? match[0] : "";
}

export async function uploadMedia(file: File) {
  const supabase = createClient();
  const isVideo = file.type.startsWith("video/");
  const path = `${isVideo ? "video" : "image"}/${crypto.randomUUID()}${extOf(file.name)}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);

  let width: number | null = null;
  let height: number | null = null;
  if (!isVideo) {
    try {
      const dims = await readImageDimensions(file);
      width = dims.width;
      height = dims.height;
    } catch {
      // ignore
    }
  }

  const { data, error } = await supabase
    .from("media_library")
    .insert({
      url: pub.publicUrl,
      storage_path: path,
      media_type: isVideo ? "video" : "image",
      filename: file.name,
      size_bytes: file.size,
      width,
      height,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMedia(id: string, storagePath: string) {
  const supabase = createClient();
  await supabase.storage.from("media").remove([storagePath]);
  const { error } = await supabase.from("media_library").delete().eq("id", id);
  if (error) throw error;
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}
