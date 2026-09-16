import { createClient } from "@/lib/supabase/server";
import { isPreviewViewer } from "@/lib/preview";
import { PreviewBanner } from "@/components/site/PreviewBanner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { HeroSection } from "@/components/site/HeroSection";
import { About } from "@/components/site/About";
import { CustomSection } from "@/components/site/CustomSection";
import { Work } from "@/components/site/Work";
import { Services } from "@/components/site/Services";
import { Experience } from "@/components/site/Experience";
import { Blog } from "@/components/site/Blog";
import { Live } from "@/components/site/Live";
import { Contact } from "@/components/site/Contact";
import type { Tables } from "@/lib/database.types";

const REGISTRY: Record<string, React.ComponentType> = {
  hero: HeroSection,
  about: About,
  work: Work,
  services: Services,
  experience: Experience,
  blog: Blog,
  live: Live,
  contact: Contact,
};

export default async function Home() {
  const supabase = await createClient();
  const preview = await isPreviewViewer();

  const query = supabase.from("sections").select("*").order("sort_order");
  const { data: sections } = preview ? await query : await query.eq("visible", true);

  return (
    <>
      {preview && <PreviewBanner />}
      <Header />
      <main className="flex-1">
        {(sections ?? []).map((section: Tables<"sections">) => {
          const hidden = preview && !section.visible;
          const body = (() => {
            if (section.section_type === "custom") {
              return <CustomSection title={section.title} body={section.custom_body} />;
            }
            const Component = REGISTRY[section.section_type];
            return Component ? <Component /> : null;
          })();

          if (!body) return null;

          return (
            <div key={section.id} id={section.key} className={hidden ? "relative opacity-60" : undefined}>
              {hidden && (
                <span className="absolute left-2 top-2 z-10 rounded bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white">
                  Hidden — preview only
                </span>
              )}
              {body}
            </div>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
