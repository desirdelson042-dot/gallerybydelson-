import { createClient } from "@/lib/supabase/server";
import { SocialIcon, socialLabel } from "./SocialIcon";
import { cn } from "@/lib/utils";

export async function SocialLinks({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  if (!data || data.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {data.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={link.label || socialLabel(link.platform)}
          className="text-neutral-500 transition hover:text-neutral-900"
        >
          {link.icon ? (
            <span className="text-lg leading-none">{link.icon}</span>
          ) : (
            <SocialIcon platform={link.platform} className={cn("h-5 w-5", iconClassName)} />
          )}
        </a>
      ))}
    </div>
  );
}
