import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { ColorInput } from "@/components/ui/ColorInput";
import { RangeInput } from "@/components/ui/RangeInput";
import { ImagePicker } from "@/components/admin/ImagePicker";
import type { HeroContent } from "@/components/site/Hero";

const GRADIENT_DIRECTIONS = [
  "to top",
  "to bottom",
  "to left",
  "to right",
  "to top left",
  "to top right",
  "to bottom left",
  "to bottom right",
];

export function BackgroundTab({
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
      <Field label="Background type">
        <Select value={content.background_type} onChange={(e) => patch({ background_type: e.target.value })}>
          <option value="solid">Solid color</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </Select>
      </Field>

      {content.background_type === "solid" && (
        <Field label="Background color">
          <ColorInput value={content.bg_color} onChange={(v) => patch({ bg_color: v })} />
        </Field>
      )}

      {content.background_type === "gradient" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Color 1">
              <ColorInput value={content.bg_color} onChange={(v) => patch({ bg_color: v })} />
            </Field>
            <Field label="Color 2">
              <ColorInput value={content.bg_color_secondary} onChange={(v) => patch({ bg_color_secondary: v })} />
            </Field>
          </div>
          <Field label="Gradient direction">
            <Select value={content.gradient_direction} onChange={(e) => patch({ gradient_direction: e.target.value })}>
              {GRADIENT_DIRECTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          </Field>
        </>
      )}

      {content.background_type === "image" && (
        <>
          <Field label="Desktop background image">
            <ImagePicker value={content.bg_image_url} onChange={(v) => patch({ bg_image_url: v })} />
          </Field>
          <Field label="Mobile background image (optional)">
            <ImagePicker value={content.mobile_bg_image_url} onChange={(v) => patch({ mobile_bg_image_url: v })} />
          </Field>
        </>
      )}

      {content.background_type === "video" && (
        <>
          <Field label="Desktop background video">
            <ImagePicker
              value={content.bg_video_url}
              onChange={(v) => patch({ bg_video_url: v })}
              accept="video"
            />
          </Field>
          <Field label="Mobile background video (optional)">
            <ImagePicker
              value={content.mobile_bg_video_url}
              onChange={(v) => patch({ mobile_bg_video_url: v })}
              accept="video"
            />
          </Field>
        </>
      )}

      {(content.background_type === "image" || content.background_type === "video") && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Image/video position">
              <Select
                value={content.bg_image_object_position}
                onChange={(e) => patch({ bg_image_object_position: e.target.value })}
              >
                {["top", "center", "bottom", "left", "right"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Background size">
              <Select value={content.bg_size} onChange={(e) => patch({ bg_size: e.target.value })}>
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
              </Select>
            </Field>
          </div>
          <Field label="Scale">
            <RangeInput
              value={content.bg_image_scale}
              onChange={(v) => patch({ bg_image_scale: v })}
              min={1}
              max={2}
              step={0.05}
              suffix="×"
            />
          </Field>
          <Field label="Blur">
            <RangeInput value={content.blur} onChange={(v) => patch({ blur: v })} min={0} max={20} step={1} suffix="px" />
          </Field>
          <Field label="Brightness">
            <RangeInput
              value={content.brightness}
              onChange={(v) => patch({ brightness: v })}
              min={0.2}
              max={1.5}
              step={0.05}
            />
          </Field>
          <Switch
            checked={content.overlay_enabled}
            onChange={(v) => patch({ overlay_enabled: v })}
            label="Enable overlay"
          />
          {content.overlay_enabled && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Overlay color">
                <ColorInput value={content.overlay_color} onChange={(v) => patch({ overlay_color: v })} />
              </Field>
              <Field label="Overlay opacity">
                <RangeInput
                  value={content.overlay_opacity}
                  onChange={(v) => patch({ overlay_opacity: v })}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </Field>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end border-t border-neutral-100 pt-4">
        <Button variant="primary" onClick={onSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
