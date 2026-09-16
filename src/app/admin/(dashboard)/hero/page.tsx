import { createClient } from "@/lib/supabase/server";
import { HeroEditor } from "@/components/admin/hero/HeroEditor";

export default async function HeroAdminPage() {
  const supabase = await createClient();
  const [{ data: content }, { data: images }, { data: textBlocks }] = await Promise.all([
    supabase.from("hero_content").select("*").eq("id", 1).single(),
    supabase.from("hero_images").select("*").order("sort_order"),
    supabase.from("hero_text_blocks").select("*").order("sort_order"),
  ]);

  if (!content) return null;

  return (
    <HeroEditor
      initialContent={content}
      initialImages={images ?? []}
      initialTextBlocks={textBlocks ?? []}
    />
  );
}
