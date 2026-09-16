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

type Service = Tables<"services">;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServices(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function persistOrder(items: Service[]) {
    setServices(items);
    await Promise.all(
      items.map((s, i) => supabase.from("services").update({ sort_order: i }).eq("id", s.id)),
    );
  }

  async function update(id: string, fields: Partial<Service>) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...fields } : s)));
    await supabase.from("services").update(fields).eq("id", id);
  }

  async function addService() {
    const { data, error } = await supabase
      .from("services")
      .insert({ title: "New service", sort_order: services.length })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setServices((prev) => [...prev, data]);
    toast.success("Service added");
  }

  async function deleteService(service: Service) {
    const ok = await confirm({
      title: `Delete "${service.title}"?`,
      description: "This removes the service from your homepage. This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    await supabase.from("services").delete().eq("id", service.id);
    setServices((prev) => prev.filter((s) => s.id !== service.id));
    toast.success("Service deleted");
  }

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Services</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Drag to reorder, toggle visibility, or add a new service.
        </p>
      </div>

      <Card>
        <SortableList
          items={services}
          onReorder={persistOrder}
          renderItem={(service) => (
            <div className="rounded-md border border-neutral-200 p-4">
              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <ImagePicker
                  value={service.image_url}
                  onChange={(url) => update(service.id, { image_url: url || null })}
                  accept="image"
                  label="Choose image"
                />
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-[1fr_100px]">
                    <Field label="Title">
                      <Input
                        defaultValue={service.title}
                        onBlur={(e) => update(service.id, { title: e.target.value })}
                      />
                    </Field>
                    <Field label="Icon">
                      <Input
                        placeholder="✨"
                        defaultValue={service.icon}
                        onBlur={(e) => update(service.id, { icon: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Description">
                    <Textarea
                      defaultValue={service.description}
                      onBlur={(e) => update(service.id, { description: e.target.value })}
                      rows={3}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="CTA text">
                      <Input
                        placeholder="Learn more"
                        defaultValue={service.cta_text}
                        onBlur={(e) => update(service.id, { cta_text: e.target.value })}
                      />
                    </Field>
                    <Field label="CTA URL">
                      <Input
                        placeholder="https://…"
                        defaultValue={service.cta_url}
                        onBlur={(e) => update(service.id, { cta_url: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                <Switch
                  checked={service.visible}
                  onChange={(v) => update(service.id, { visible: v })}
                  label={service.visible ? "Visible" : "Hidden"}
                />
                <Button variant="danger" onClick={() => deleteService(service)}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        />
      </Card>

      <Button variant="secondary" onClick={addService}>
        + Add service
      </Button>
    </div>
  );
}
