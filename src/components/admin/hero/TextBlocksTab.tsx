"use client";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { SortableList } from "@/components/ui/SortableList";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import type { HeroTextBlock } from "@/components/site/Hero";

export function TextBlocksTab({
  textBlocks,
  setTextBlocks,
}: {
  textBlocks: HeroTextBlock[];
  setTextBlocks: React.Dispatch<React.SetStateAction<HeroTextBlock[]>>;
}) {
  const supabase = createClient();
  const confirm = useConfirm();

  async function addBlock() {
    const { data, error } = await supabase
      .from("hero_text_blocks")
      .insert({ block_type: "custom", content: "New text block", sort_order: textBlocks.length })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setTextBlocks((prev) => [...prev, data]);
  }

  async function updateContent(id: string, value: string) {
    setTextBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: value } : b)));
    await supabase.from("hero_text_blocks").update({ content: value }).eq("id", id);
  }

  async function toggleVisible(block: HeroTextBlock) {
    setTextBlocks((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, visible: !b.visible } : b)),
    );
    await supabase.from("hero_text_blocks").update({ visible: !block.visible }).eq("id", block.id);
  }

  async function remove(block: HeroTextBlock) {
    const ok = await confirm({ title: "Delete this text block?", confirmLabel: "Delete", danger: true });
    if (!ok) return;
    await supabase.from("hero_text_blocks").delete().eq("id", block.id);
    setTextBlocks((prev) => prev.filter((b) => b.id !== block.id));
  }

  async function persistOrder(items: HeroTextBlock[]) {
    setTextBlocks(items);
    await Promise.all(
      items.map((b, i) => supabase.from("hero_text_blocks").update({ sort_order: i }).eq("id", b.id)),
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500">
        Add extra lines of text below your description — announcements, taglines, anything.
      </p>
      <SortableList
        items={textBlocks}
        onReorder={persistOrder}
        renderItem={(block) => (
          <div className="flex items-center gap-2 rounded-md border border-neutral-200 p-2">
            <input
              defaultValue={block.content}
              onBlur={(e) => updateContent(block.id, e.target.value)}
              className="flex-1 rounded-md border border-transparent px-2 py-1.5 text-sm outline-none focus:border-neutral-300"
            />
            <Switch checked={block.visible} onChange={() => toggleVisible(block)} />
            <Button variant="danger" onClick={() => remove(block)}>
              Delete
            </Button>
          </div>
        )}
      />
      <Button variant="secondary" onClick={addBlock}>
        + Add text block
      </Button>
    </div>
  );
}
