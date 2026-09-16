import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { HeroContent } from "@/components/site/Hero";

function Option({ value, label }: { value: string; label: string }) {
  return (
    <option value={value}>
      {label}
    </option>
  );
}

export function LayoutTab({
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
      <div className="grid grid-cols-2 gap-4">
        <Field label="Text alignment">
          <Select value={content.text_alignment} onChange={(e) => patch({ text_alignment: e.target.value })}>
            <Option value="left" label="Left" />
            <Option value="center" label="Center" />
            <Option value="right" label="Right" />
          </Select>
        </Field>
        <Field label="Text position" hint="Used in overlay layout">
          <Select value={content.text_position} onChange={(e) => patch({ text_position: e.target.value })}>
            {["top-left", "top-center", "top-right", "center", "bottom-left", "bottom-center", "bottom-right"].map(
              (p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ),
            )}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Image position">
          <Select value={content.image_position} onChange={(e) => patch({ image_position: e.target.value })}>
            <Option value="left" label="Left of text" />
            <Option value="right" label="Right of text" />
            <Option value="background" label="Full background" />
            <Option value="none" label="No image" />
          </Select>
        </Field>
        <Field label="Hero height">
          <Select value={content.hero_height} onChange={(e) => patch({ hero_height: e.target.value })}>
            <Option value="small" label="Small" />
            <Option value="medium" label="Medium" />
            <Option value="large" label="Large" />
            <Option value="fullscreen" label="Fullscreen" />
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Content width">
          <Select value={content.content_width} onChange={(e) => patch({ content_width: e.target.value })}>
            <Option value="contained" label="Contained" />
            <Option value="wide" label="Wide" />
            <Option value="full" label="Full width" />
          </Select>
        </Field>
        <Field label="Section spacing" hint="Space below hero">
          <Select value={content.section_spacing} onChange={(e) => patch({ section_spacing: e.target.value })}>
            <Option value="tight" label="Tight" />
            <Option value="normal" label="Normal" />
            <Option value="loose" label="Loose" />
          </Select>
        </Field>
      </div>

      <Field label="Padding">
        <Select value={content.padding} onChange={(e) => patch({ padding: e.target.value })}>
          <Option value="tight" label="Tight" />
          <Option value="normal" label="Normal" />
          <Option value="loose" label="Loose" />
        </Select>
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Desktop layout">
          <Select value={content.desktop_layout} onChange={(e) => patch({ desktop_layout: e.target.value })}>
            <Option value="split" label="Split" />
            <Option value="stacked" label="Stacked" />
            <Option value="overlay" label="Overlay" />
          </Select>
        </Field>
        <Field label="Tablet layout">
          <Select value={content.tablet_layout} onChange={(e) => patch({ tablet_layout: e.target.value })}>
            <Option value="split" label="Split" />
            <Option value="stacked" label="Stacked" />
            <Option value="overlay" label="Overlay" />
          </Select>
        </Field>
        <Field label="Mobile layout">
          <Select value={content.mobile_layout} onChange={(e) => patch({ mobile_layout: e.target.value })}>
            <Option value="split" label="Split" />
            <Option value="stacked" label="Stacked" />
            <Option value="overlay" label="Overlay" />
          </Select>
        </Field>
      </div>

      <div className="flex justify-end border-t border-neutral-100 pt-4">
        <Button variant="primary" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
