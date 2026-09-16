import { createClient } from "@/lib/supabase/server";
import { SocialLinks } from "./SocialLinks";

type FooterContent = { copyright_text?: string; note?: string };

export async function Footer() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("footer_content, site_title").eq("id", 1).single();
  const footer = (data?.footer_content as FooterContent) ?? {};

  return (
    <footer className="border-t border-neutral-100 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm text-neutral-500">
            {footer.copyright_text || `© ${new Date().getFullYear()} ${data?.site_title ?? ""}`}
          </p>
          {footer.note && <p className="mt-1 text-xs text-neutral-400">{footer.note}</p>}
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
