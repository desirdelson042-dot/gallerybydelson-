import { createClient } from "@/lib/supabase/server";

/**
 * True when the current visitor is signed in as the site admin. RLS already
 * grants admins visibility into draft/unpublished rows, so an admin browsing
 * the public site is automatically viewing a live preview of unpublished
 * work — this just tells page components whether to say so and to also
 * reveal hidden (visible=false) sections, which aren't gated by RLS.
 */
export async function isPreviewViewer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.rpc("is_admin");
  return Boolean(data);
}
