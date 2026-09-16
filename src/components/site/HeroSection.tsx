import { createClient } from "@/lib/supabase/server";
import { Hero } from "./Hero";

export async function HeroSection() {
  const supabase = await createClient();
  const [{ data: content }, { data: images }, { data: textBlocks }] = await Promise.all([
    supabase.from("hero_content").select("*").eq("id", 1).single(),
    supabase.from("hero_images").select("*").order("sort_order"),
    supabase.from("hero_text_blocks").select("*").eq("visible", true).order("sort_order"),
  ]);

  if (!content) return null;

  return <Hero content={content} images={images ?? []} textBlocks={textBlocks ?? []} />;
}
