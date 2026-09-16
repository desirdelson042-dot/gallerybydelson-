"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { toast } from "sonner";

type SiteSettings = Tables<"site_settings">;
type FooterContent = { copyright_text?: string; note?: string };

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [footer, setFooter] = useState<FooterContent>({});
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSettings(data);
          setFooter((data.footer_content as FooterContent) ?? {});
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        site_title: settings.site_title,
        site_description: settings.site_description,
        favicon_url: settings.favicon_url,
        meta_image_url: settings.meta_image_url,
        footer_content: footer,
      })
      .eq("id", 1);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Site settings</h1>
        <p className="mt-1 text-sm text-neutral-500">Global metadata, favicon, and footer.</p>
      </div>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">General</h2>
        <Field label="Site title">
          <Input value={settings.site_title} onChange={(e) => setSettings({ ...settings, site_title: e.target.value })} />
        </Field>
        <Field label="Site description">
          <Textarea
            value={settings.site_description}
            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
          />
        </Field>
        <Field label="Favicon">
          <ImagePicker value={settings.favicon_url} onChange={(v) => setSettings({ ...settings, favicon_url: v })} />
        </Field>
        <Field label="Social share image">
          <ImagePicker value={settings.meta_image_url} onChange={(v) => setSettings({ ...settings, meta_image_url: v })} />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">Footer</h2>
        <Field label="Copyright text">
          <Input
            value={footer.copyright_text ?? ""}
            onChange={(e) => setFooter({ ...footer, copyright_text: e.target.value })}
            placeholder="© 2026 Your Name"
          />
        </Field>
        <Field label="Footer note">
          <Textarea
            value={footer.note ?? ""}
            onChange={(e) => setFooter({ ...footer, note: e.target.value })}
            placeholder="Designed & built with care."
          />
        </Field>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </div>
  );
}
