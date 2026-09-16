import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import type { HeroContent } from "@/components/site/Hero";

export function ContentTab({
  content,
  patch,
  onSave,
  saving,
}: {
  content: HeroContent;
  patch: (fields: Partial<HeroContent>) => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Field label="Title" className="flex-1">
          <Input value={content.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Switch checked={content.title_visible} onChange={(v) => patch({ title_visible: v })} label="Show" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Field label="Subtitle" className="flex-1">
          <Input value={content.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} />
        </Field>
        <Switch checked={content.subtitle_visible} onChange={(v) => patch({ subtitle_visible: v })} label="Show" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <Field label="Description" className="flex-1">
          <Textarea value={content.description} onChange={(e) => patch({ description: e.target.value })} />
        </Field>
        <Switch checked={content.description_visible} onChange={(v) => patch({ description_visible: v })} label="Show" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA button text">
          <Input value={content.cta_text} onChange={(e) => patch({ cta_text: e.target.value })} />
        </Field>
        <Field label="CTA button URL">
          <Input value={content.cta_url} onChange={(e) => patch({ cta_url: e.target.value })} placeholder="/contact or https://…" />
        </Field>
      </div>
      <Switch checked={content.cta_enabled} onChange={(v) => patch({ cta_enabled: v })} label="Show CTA button" />

      <div className="flex justify-end border-t border-neutral-100 pt-4">
        <Button variant="primary" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
