"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input, Textarea } from "@/components/ui/Input";
import { toast } from "sonner";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      if (error) throw error;

      toast.success("Message sent — thanks for reaching out!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-24">
      <p className="text-sm uppercase tracking-wide text-neutral-400">Contact</p>
      <h2 className="mt-2 text-3xl font-semibold">Get in touch</h2>
      <p className="mt-3 text-neutral-500">
        Have a project in mind or just want to say hello? Send a message and I&apos;ll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="block text-xs font-medium text-neutral-600">
              Name
            </label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="block text-xs font-medium text-neutral-600">
              Email
            </label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="block text-xs font-medium text-neutral-600">
            Subject <span className="text-neutral-400">(optional)</span>
          </label>
          <Input
            id="contact-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's this about?"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="block text-xs font-medium text-neutral-600">
            Message
          </label>
          <Textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me a bit about what you have in mind…"
            rows={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
}
