"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { SOCIAL_PLATFORMS, socialLabel } from "@/components/site/SocialIcon";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { SortableList } from "@/components/ui/SortableList";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

type SocialLink = Tables<"social_links">;

export default function SocialPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const confirm = useConfirm();

  async function load() {
    const { data } = await supabase.from("social_links").select("*").order("sort_order");
    setLinks(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addLink() {
    const { data, error } = await supabase
      .from("social_links")
      .insert({ platform: "instagram", url: "", sort_order: links.length })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setLinks((prev) => [...prev, data]);
  }

  async function update(id: string, fields: Partial<SocialLink>) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...fields } : l)));
    await supabase.from("social_links").update(fields).eq("id", id);
  }

  async function remove(link: SocialLink) {
    const ok = await confirm({ title: `Remove ${socialLabel(link.platform)}?`, confirmLabel: "Remove", danger: true });
    if (!ok) return;
    await supabase.from("social_links").delete().eq("id", link.id);
    setLinks((prev) => prev.filter((l) => l.id !== link.id));
  }

  async function persistOrder(items: SocialLink[]) {
    setLinks(items);
    await Promise.all(
      items.map((l, i) => supabase.from("social_links").update({ sort_order: i }).eq("id", l.id)),
    );
  }

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Social media</h1>
        <p className="mt-1 text-sm text-neutral-500">
          One place to manage every social link. Update a URL here and it updates everywhere on
          your site automatically.
        </p>
      </div>

      <Card>
        <SortableList
          items={links}
          onReorder={persistOrder}
          renderItem={(link) => (
            <div className="grid grid-cols-1 items-center gap-2 rounded-md border border-neutral-200 p-3 sm:grid-cols-[160px_1fr_100px_auto_auto]">
              <Select value={link.platform} onChange={(e) => update(link.id, { platform: e.target.value })}>
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {socialLabel(p)}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </Select>
              <Input
                placeholder="https://…"
                defaultValue={link.url}
                onBlur={(e) => update(link.id, { url: e.target.value })}
              />
              <Input
                placeholder="Icon (emoji, optional)"
                defaultValue={link.icon}
                onBlur={(e) => update(link.id, { icon: e.target.value })}
              />
              <Switch checked={link.active} onChange={(v) => update(link.id, { active: v })} label={link.active ? "On" : "Off"} />
              <Button variant="danger" onClick={() => remove(link)}>
                Remove
              </Button>
            </div>
          )}
        />
      </Card>

      <Button variant="secondary" onClick={addLink}>
        + Add social link
      </Button>
    </div>
  );
}
