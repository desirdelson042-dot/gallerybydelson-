"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Tabs } from "@/components/ui/Tabs";
import { Hero, type HeroContent, type HeroImage, type HeroTextBlock } from "@/components/site/Hero";
import { ContentTab } from "./ContentTab";
import { TextBlocksTab } from "./TextBlocksTab";
import { ImagesTab } from "./ImagesTab";
import { BackgroundTab } from "./BackgroundTab";
import { LayoutTab } from "./LayoutTab";

export function HeroEditor({
  initialContent,
  initialImages,
  initialTextBlocks,
}: {
  initialContent: HeroContent;
  initialImages: HeroImage[];
  initialTextBlocks: HeroTextBlock[];
}) {
  const [content, setContent] = useState<HeroContent>(initialContent);
  const [images, setImages] = useState<HeroImage[]>(initialImages);
  const [textBlocks, setTextBlocks] = useState<HeroTextBlock[]>(initialTextBlocks);
  const [saving, setSaving] = useState(false);

  function patch(fields: Partial<HeroContent>) {
    setContent((prev) => ({ ...prev, ...fields }));
  }

  async function save() {
    setSaving(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, updated_at, ...rest } = content;
    const { error } = await supabase.from("hero_content").update(rest).eq("id", 1);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Hero saved");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Hero editor</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Full control over your homepage&apos;s first impression — text, images, background, and layout.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <Tabs
            tabs={[
              {
                label: "Content",
                content: <ContentTab content={content} patch={patch} onSave={save} saving={saving} />,
              },
              {
                label: "Text blocks",
                content: <TextBlocksTab textBlocks={textBlocks} setTextBlocks={setTextBlocks} />,
              },
              {
                label: "Images",
                content: <ImagesTab images={images} setImages={setImages} />,
              },
              {
                label: "Background",
                content: <BackgroundTab content={content} patch={patch} onSave={save} saving={saving} />,
              },
              {
                label: "Layout",
                content: <LayoutTab content={content} patch={patch} onSave={save} saving={saving} />,
              },
            ]}
          />
        </div>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-400">
            Live preview
          </p>
          <div className="h-[420px] overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
            <div
              style={{ width: "1200px", transform: "scale(0.35)", transformOrigin: "top left" }}
            >
              <Hero content={content} images={images} textBlocks={textBlocks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
