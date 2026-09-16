"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { cn, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type ContactMessage = Tables<"contact_messages">;

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const confirm = useConfirm();
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleOpen(message: ContactMessage) {
    const next = openId === message.id ? null : message.id;
    setOpenId(next);
    if (next && !message.is_read) {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m)));
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: true })
        .eq("id", message.id);
      if (error) toast.error(error.message);
    }
  }

  async function deleteMessage(message: ContactMessage) {
    const ok = await confirm({
      title: `Delete message from ${message.name}?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", message.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== message.id));
    toast.success("Message deleted");
  }

  if (loading) return null;

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Messages</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {messages.length === 0
            ? "No messages yet."
            : `${unreadCount} unread of ${messages.length} message${messages.length === 1 ? "" : "s"}.`}
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <p className="text-sm text-neutral-400">
            Submissions from your site&apos;s contact form will show up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => {
            const isOpen = openId === message.id;
            return (
              <Card key={message.id} className="p-0">
                <button
                  type="button"
                  onClick={() => toggleOpen(message)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {!message.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-neutral-900" aria-hidden />
                    )}
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "truncate text-sm",
                          message.is_read ? "font-normal text-neutral-700" : "font-semibold text-neutral-900",
                        )}
                      >
                        {message.name}
                        {message.subject && (
                          <span className="ml-2 text-neutral-400">— {message.subject}</span>
                        )}
                      </p>
                      <p className="truncate text-xs text-neutral-400">{message.email}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">{formatDate(message.created_at)}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-neutral-200 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                      <span>
                        From <span className="font-medium text-neutral-700">{message.name}</span>
                      </span>
                      <a href={`mailto:${message.email}`} className="text-neutral-600 underline hover:text-neutral-900">
                        {message.email}
                      </a>
                      <span>{formatDate(message.created_at)}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm text-neutral-700">{message.message}</p>
                    <div className="mt-4 flex justify-end">
                      <Button variant="danger" onClick={() => deleteMessage(message)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
