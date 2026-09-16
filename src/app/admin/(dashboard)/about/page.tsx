import { createClient } from "@/lib/supabase/server";
import { AboutEditor } from "@/components/admin/about/AboutEditor";

export default async function AboutAdminPage() {
  const supabase = await createClient();
  const [{ data: content }, { data: skills }, { data: stats }, { data: blocks }] =
    await Promise.all([
      supabase.from("about_content").select("*").eq("id", 1).single(),
      supabase.from("about_skills").select("*").order("sort_order"),
      supabase.from("about_stats").select("*").order("sort_order"),
      supabase.from("about_blocks").select("*").order("sort_order"),
    ]);

  if (!content) return null;

  return (
    <AboutEditor
      initialContent={content}
      initialSkills={skills ?? []}
      initialStats={stats ?? []}
      initialBlocks={blocks ?? []}
    />
  );
}
