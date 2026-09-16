"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { SortableList } from "@/components/ui/SortableList";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

type Section = Tables<"sections">;

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const confirm = useConfirm();
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("sections").select("*").order("sort_order");
    setSections(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function persistOrder(items: Section[]) {
    setSections(items);
    await Promise.all(
      items.map((s, i) => supabase.from("sections").update({ sort_order: i }).eq("id", s.id)),
    );
  }

  async function toggleVisible(section: Section) {
    setSections((prev) =>
      prev.map((s) => (s.id === section.id ? { ...s, visible: !s.visible } : s)),
    );
    await supabase.from("sections").update({ visible: !section.visible }).eq("id", section.id);
  }

  async function addSection() {
    if (!newTitle.trim()) return;
    const key = `custom_${crypto.randomUUID().slice(0, 8)}`;
    const { data, error } = await supabase
      .from("sections")
      .insert({
        key,
        title: newTitle,
        section_type: "custom",
        sort_order: sections.length,
        is_deletable: true,
        custom_body: "",
      })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setSections((prev) => [...prev, data]);
    setNewTitle("");
    toast.success("Section added");
  }

  async function duplicateSection(section: Section) {
    const key = `custom_${crypto.randomUUID().slice(0, 8)}`;
    const { data, error } = await supabase
      .from("sections")
      .insert({
        key,
        title: `${section.title} copy`,
        section_type: section.section_type,
        sort_order: sections.length,
        is_deletable: true,
        custom_body: section.custom_body,
        visible: section.visible,
      })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setSections((prev) => [...prev, data]);
  }

  async function deleteSection(section: Section) {
    const ok = await confirm({
      title: `Delete "${section.title}"?`,
      description: "This removes the section from your homepage. This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    await supabase.from("sections").delete().eq("id", section.id);
    setSections((prev) => prev.filter((s) => s.id !== section.id));
    toast.success("Section deleted");
  }

  async function updateBody(section: Section, body: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === section.id ? { ...s, custom_body: body } : s)),
    );
    await supabase.from("sections").update({ custom_body: body }).eq("id", section.id);
  }

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Homepage sections</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Drag to reorder, toggle visibility, or add your own custom sections.
        </p>
      </div>

      <Card>
        <SortableList
          items={sections}
          onReorder={persistOrder}
          renderItem={(section) => (
            <div className="rounded-md border border-neutral-200 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{section.title}</p>
                  <p className="text-xs text-neutral-400">{section.section_type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={section.visible} onChange={() => toggleVisible(section)} label={section.visible ? "On" : "Off"} />
                  {section.is_deletable && (
                    <>
                      <Button variant="ghost" onClick={() => duplicateSection(section)}>
                        Duplicate
                      </Button>
                      <Button variant="danger" onClick={() => deleteSection(section)}>
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {section.section_type === "custom" && (
                <textarea
                  className="mt-3 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  placeholder="Section content…"
                  defaultValue={section.custom_body ?? ""}
                  onBlur={(e) => updateBody(section, e.target.value)}
                  rows={3}
                />
              )}
            </div>
          )}
        />
      </Card>

      <Card>
        <h2 className="text-sm font-semibold">Add a custom section</h2>
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Section title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Button variant="primary" onClick={addSection}>
            Add section
          </Button>
        </div>
      </Card>
    </div>
  );
}
