"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Switch";
import { SortableList } from "@/components/ui/SortableList";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

type Experience = Tables<"experience">;

export default function ExperiencePage() {
  const [entries, setEntries] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("experience").select("*").order("sort_order");
    setEntries(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function persistOrder(items: Experience[]) {
    setEntries(items);
    await Promise.all(
      items.map((e, i) => supabase.from("experience").update({ sort_order: i }).eq("id", e.id)),
    );
  }

  async function update(id: string, fields: Partial<Experience>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...fields } : e)));
    await supabase.from("experience").update(fields).eq("id", id);
  }

  async function toggleCurrent(entry: Experience) {
    const nextCurrent = !entry.is_current;
    await update(entry.id, { is_current: nextCurrent, end_date: nextCurrent ? null : entry.end_date });
  }

  async function addEntry() {
    const { data, error } = await supabase
      .from("experience")
      .insert({ company: "New company", position: "", sort_order: entries.length })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setEntries((prev) => [...prev, data]);
    toast.success("Experience added");
  }

  async function deleteEntry(entry: Experience) {
    const ok = await confirm({
      title: `Delete "${entry.company}"?`,
      description: "This removes the entry from your homepage. This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    await supabase.from("experience").delete().eq("id", entry.id);
    setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    toast.success("Experience deleted");
  }

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Experience</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Drag to reorder, edit each entry, or add a new one.
        </p>
      </div>

      <Card>
        <SortableList
          items={entries}
          onReorder={persistOrder}
          renderItem={(entry) => (
            <div className="rounded-md border border-neutral-200 p-4">
              <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                <ImagePicker
                  value={entry.logo_url}
                  onChange={(url) => update(entry.id, { logo_url: url || null })}
                  accept="image"
                  label="Logo"
                />
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Company">
                      <Input
                        defaultValue={entry.company}
                        onBlur={(e) => update(entry.id, { company: e.target.value })}
                      />
                    </Field>
                    <Field label="Position">
                      <Input
                        defaultValue={entry.position}
                        onBlur={(e) => update(entry.id, { position: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <Textarea
                      defaultValue={entry.description}
                      onBlur={(e) => update(entry.id, { description: e.target.value })}
                      rows={3}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Start date">
                      <Input
                        type="date"
                        defaultValue={entry.start_date ?? ""}
                        onBlur={(e) => update(entry.id, { start_date: e.target.value || null })}
                      />
                    </Field>
                    <Field label="End date" hint={entry.is_current ? "Cleared while current" : undefined}>
                      <Input
                        type="date"
                        disabled={entry.is_current}
                        defaultValue={entry.end_date ?? ""}
                        onBlur={(e) => update(entry.id, { end_date: e.target.value || null })}
                        className={entry.is_current ? "bg-neutral-50 text-neutral-400" : undefined}
                      />
                    </Field>
                    <Field label="Website">
                      <Input
                        placeholder="https://…"
                        defaultValue={entry.url ?? ""}
                        onBlur={(e) => update(entry.id, { url: e.target.value || null })}
                      />
                    </Field>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                <Switch
                  checked={entry.is_current}
                  onChange={() => toggleCurrent(entry)}
                  label="Current position"
                />
                <Button variant="danger" onClick={() => deleteEntry(entry)}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        />
      </Card>

      <Button variant="secondary" onClick={addEntry}>
        + Add experience
      </Button>
    </div>
  );
}
