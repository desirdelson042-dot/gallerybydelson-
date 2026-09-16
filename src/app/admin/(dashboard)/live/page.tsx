"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Switch";
import { SortableList } from "@/components/ui/SortableList";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

type LiveSession = Tables<"live_sessions">;

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "live", label: "Live" },
  { value: "ended", label: "Ended" },
];

// Converts an ISO timestamptz string into the value <input type="datetime-local"> expects.
function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

// Converts a <input type="datetime-local"> value back into an ISO timestamptz string.
function fromDatetimeLocal(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default function LivePage() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const confirm = useConfirm();
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("live_sessions").select("*").order("sort_order");
    setSessions(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function persistOrder(items: LiveSession[]) {
    setSessions(items);
    await Promise.all(
      items.map((s, i) => supabase.from("live_sessions").update({ sort_order: i }).eq("id", s.id)),
    );
  }

  async function update(id: string, fields: Partial<LiveSession>) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...fields } : s)));
    const { error } = await supabase.from("live_sessions").update(fields).eq("id", id);
    if (error) toast.error(error.message);
  }

  async function addSession() {
    const { data, error } = await supabase
      .from("live_sessions")
      .insert({
        title: "New session",
        status: "scheduled",
        sort_order: sessions.length,
      })
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setSessions((prev) => [...prev, data]);
    toast.success("Live session added");
  }

  async function deleteSession(session: LiveSession) {
    const ok = await confirm({
      title: `Delete "${session.title}"?`,
      description: "This removes the session permanently. This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("live_sessions").delete().eq("id", session.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
    toast.success("Live session deleted");
  }

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">My Live</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Manage live streams, upcoming sessions, and replays shown on the homepage.
        </p>
      </div>

      <Card>
        <SortableList
          items={sessions}
          onReorder={persistOrder}
          renderItem={(session) => (
            <div className="rounded-md border border-neutral-200 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{session.title || "Untitled session"}</p>
                  {session.status === "live" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Live
                    </span>
                  )}
                </div>
                <Button variant="danger" onClick={() => deleteSession(session)}>
                  Delete
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Title">
                  <Input
                    defaultValue={session.title}
                    onBlur={(e) => update(session.id, { title: e.target.value })}
                  />
                </Field>
                <Field label="Status">
                  <Select
                    value={session.status}
                    onChange={(e) => update(session.id, { status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Description" className="sm:col-span-2">
                  <Textarea
                    defaultValue={session.description}
                    onBlur={(e) => update(session.id, { description: e.target.value })}
                    rows={3}
                  />
                </Field>

                <Field label="Thumbnail" className="sm:col-span-2">
                  <ImagePicker
                    value={session.thumbnail_url}
                    onChange={(url) => update(session.id, { thumbnail_url: url })}
                    accept="image"
                    label="Choose thumbnail"
                  />
                </Field>

                <Field label="Scheduled at" hint="Used when status is scheduled.">
                  <input
                    type="datetime-local"
                    defaultValue={toDatetimeLocal(session.scheduled_at)}
                    onBlur={(e) => update(session.id, { scheduled_at: fromDatetimeLocal(e.target.value) })}
                    className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
                  />
                </Field>
                <Field label="Stream provider" hint="e.g. youtube, twitch, custom">
                  <Input
                    defaultValue={session.stream_provider}
                    onBlur={(e) => update(session.id, { stream_provider: e.target.value })}
                  />
                </Field>

                <Field label="Stream URL" className="sm:col-span-2">
                  <Input
                    defaultValue={session.stream_url}
                    onBlur={(e) => update(session.id, { stream_url: e.target.value })}
                    placeholder="https://…"
                  />
                </Field>

                <div className="flex items-center gap-4 sm:col-span-2">
                  <Switch
                    checked={session.is_replay}
                    onChange={(v) => update(session.id, { is_replay: v })}
                    label="Is replay"
                  />
                  <Switch
                    checked={session.published}
                    onChange={(v) => update(session.id, { published: v })}
                    label={session.published ? "Published" : "Unpublished"}
                  />
                </div>

                {session.is_replay && (
                  <Field label="Replay URL" className="sm:col-span-2">
                    <Input
                      defaultValue={session.replay_url ?? ""}
                      onBlur={(e) => update(session.id, { replay_url: e.target.value || null })}
                      placeholder="https://…"
                    />
                  </Field>
                )}
              </div>
            </div>
          )}
        />
      </Card>

      <Button variant="secondary" onClick={addSession}>
        + Add live session
      </Button>
    </div>
  );
}
