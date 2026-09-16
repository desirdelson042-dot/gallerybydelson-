"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { SortableList } from "@/components/ui/SortableList";
import { Switch } from "@/components/ui/Switch";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useConfirm } from "@/components/ui/ConfirmDialog";

type AboutContent = Tables<"about_content">;
type AboutSkill = Tables<"about_skills">;
type AboutStat = Tables<"about_stats">;
type AboutBlock = Tables<"about_blocks">;

export function AboutEditor({
  initialContent,
  initialSkills,
  initialStats,
  initialBlocks,
}: {
  initialContent: AboutContent;
  initialSkills: AboutSkill[];
  initialStats: AboutStat[];
  initialBlocks: AboutBlock[];
}) {
  const [content, setContent] = useState(initialContent);
  const [skills, setSkills] = useState(initialSkills);
  const [stats, setStats] = useState(initialStats);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();
  const confirm = useConfirm();

  function patch(fields: Partial<AboutContent>) {
    setContent((prev) => ({ ...prev, ...fields }));
  }

  async function save() {
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, updated_at, ...rest } = content;
    const { error } = await supabase.from("about_content").update(rest).eq("id", 1);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("About saved");
  }

  // skills
  async function addSkill() {
    const { data, error } = await supabase
      .from("about_skills")
      .insert({ label: "New skill", sort_order: skills.length })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setSkills((prev) => [...prev, data]);
  }
  async function updateSkill(id: string, label: string) {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, label } : s)));
    await supabase.from("about_skills").update({ label }).eq("id", id);
  }
  async function removeSkill(skill: AboutSkill) {
    await supabase.from("about_skills").delete().eq("id", skill.id);
    setSkills((prev) => prev.filter((s) => s.id !== skill.id));
  }
  async function reorderSkills(items: AboutSkill[]) {
    setSkills(items);
    await Promise.all(items.map((s, i) => supabase.from("about_skills").update({ sort_order: i }).eq("id", s.id)));
  }

  // stats
  async function addStat() {
    const { data, error } = await supabase
      .from("about_stats")
      .insert({ label: "Projects", value: "50+", sort_order: stats.length })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setStats((prev) => [...prev, data]);
  }
  async function updateStat(id: string, fields: Partial<AboutStat>) {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, ...fields } : s)));
    await supabase.from("about_stats").update(fields).eq("id", id);
  }
  async function removeStat(stat: AboutStat) {
    await supabase.from("about_stats").delete().eq("id", stat.id);
    setStats((prev) => prev.filter((s) => s.id !== stat.id));
  }
  async function reorderStats(items: AboutStat[]) {
    setStats(items);
    await Promise.all(items.map((s, i) => supabase.from("about_stats").update({ sort_order: i }).eq("id", s.id)));
  }

  // blocks
  async function addBlock() {
    const { data, error } = await supabase
      .from("about_blocks")
      .insert({ heading: "New block", body: "", sort_order: blocks.length })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setBlocks((prev) => [...prev, data]);
  }
  async function updateBlock(id: string, fields: Partial<AboutBlock>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...fields } : b)));
    await supabase.from("about_blocks").update(fields).eq("id", id);
  }
  async function removeBlock(block: AboutBlock) {
    const ok = await confirm({ title: "Delete this content block?", confirmLabel: "Delete", danger: true });
    if (!ok) return;
    await supabase.from("about_blocks").delete().eq("id", block.id);
    setBlocks((prev) => prev.filter((b) => b.id !== block.id));
  }
  async function reorderBlocks(items: AboutBlock[]) {
    setBlocks(items);
    await Promise.all(items.map((b, i) => supabase.from("about_blocks").update({ sort_order: i }).eq("id", b.id)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">About</h1>
        <p className="mt-1 text-sm text-neutral-500">Everything about you, fully editable.</p>
      </div>

      <Card className="space-y-4">
        <h2 className="text-sm font-semibold">Profile</h2>
        <Field label="Profile image">
          <ImagePicker value={content.profile_image_url} onChange={(v) => patch({ profile_image_url: v })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name">
            <Input value={content.name} onChange={(e) => patch({ name: e.target.value })} />
          </Field>
          <Field label="Title">
            <Input value={content.title} onChange={(e) => patch({ title: e.target.value })} />
          </Field>
        </div>
        <Field label="Short introduction">
          <Textarea value={content.short_intro} onChange={(e) => patch({ short_intro: e.target.value })} />
        </Field>
        <Field label="Biography">
          <Textarea className="min-h-40" value={content.biography} onChange={(e) => patch({ biography: e.target.value })} />
        </Field>
        <Field label="Personal statement">
          <Textarea value={content.personal_statement} onChange={(e) => patch({ personal_statement: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA text">
            <Input value={content.cta_text} onChange={(e) => patch({ cta_text: e.target.value })} />
          </Field>
          <Field label="CTA URL">
            <Input value={content.cta_url} onChange={(e) => patch({ cta_url: e.target.value })} />
          </Field>
        </div>
        <div className="flex justify-end border-t border-neutral-100 pt-4">
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">Skills</h2>
        <div className="mt-3">
          <SortableList
            items={skills}
            onReorder={reorderSkills}
            renderItem={(skill) => (
              <div className="flex items-center gap-2 rounded-md border border-neutral-200 p-2">
                <input
                  defaultValue={skill.label}
                  onBlur={(e) => updateSkill(skill.id, e.target.value)}
                  className="flex-1 rounded-md border border-transparent px-2 py-1 text-sm outline-none focus:border-neutral-300"
                />
                <Button variant="danger" onClick={() => removeSkill(skill)}>
                  Remove
                </Button>
              </div>
            )}
          />
        </div>
        <Button variant="secondary" className="mt-3" onClick={addSkill}>
          + Add skill
        </Button>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">Stats</h2>
        <div className="mt-3">
          <SortableList
            items={stats}
            onReorder={reorderStats}
            renderItem={(stat) => (
              <div className="flex items-center gap-2 rounded-md border border-neutral-200 p-2">
                <input
                  defaultValue={stat.value}
                  placeholder="50+"
                  onBlur={(e) => updateStat(stat.id, { value: e.target.value })}
                  className="w-24 rounded-md border border-transparent px-2 py-1 text-sm outline-none focus:border-neutral-300"
                />
                <input
                  defaultValue={stat.label}
                  placeholder="Projects completed"
                  onBlur={(e) => updateStat(stat.id, { label: e.target.value })}
                  className="flex-1 rounded-md border border-transparent px-2 py-1 text-sm outline-none focus:border-neutral-300"
                />
                <Button variant="danger" onClick={() => removeStat(stat)}>
                  Remove
                </Button>
              </div>
            )}
          />
        </div>
        <Button variant="secondary" className="mt-3" onClick={addStat}>
          + Add stat
        </Button>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">Content blocks</h2>
        <div className="mt-3">
          <SortableList
            items={blocks}
            onReorder={reorderBlocks}
            renderItem={(block) => (
              <div className="space-y-2 rounded-md border border-neutral-200 p-3">
                <div className="flex items-center gap-2">
                  <input
                    defaultValue={block.heading}
                    placeholder="Heading"
                    onBlur={(e) => updateBlock(block.id, { heading: e.target.value })}
                    className="flex-1 rounded-md border border-neutral-200 px-2 py-1 text-sm font-medium outline-none focus:border-neutral-400"
                  />
                  <Switch checked={block.visible} onChange={(v) => updateBlock(block.id, { visible: v })} />
                  <Button variant="danger" onClick={() => removeBlock(block)}>
                    Delete
                  </Button>
                </div>
                <textarea
                  defaultValue={block.body}
                  placeholder="Body text…"
                  onBlur={(e) => updateBlock(block.id, { body: e.target.value })}
                  className="w-full rounded-md border border-neutral-200 px-2 py-1.5 text-sm outline-none focus:border-neutral-400"
                  rows={3}
                />
              </div>
            )}
          />
        </div>
        <Button variant="secondary" className="mt-3" onClick={addBlock}>
          + Add content block
        </Button>
      </Card>
    </div>
  );
}
