"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [checkError, setCheckError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("has_admin");
        if (cancelled) return;
        if (error) {
          setCheckError(error.message);
          setChecking(false);
          return;
        }
        if (!data) {
          router.replace("/admin/setup");
        } else {
          setChecking(false);
        }
      } catch (err) {
        if (cancelled) return;
        setCheckError(err instanceof Error ? err.message : "Could not reach Supabase.");
        setChecking(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    // idempotent: no-op if an admin already exists and this isn't them
    await supabase.rpc("claim_admin");
    router.replace("/admin");
    router.refresh();
  }

  if (checking) return null;

  if (checkError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
        <Card className="w-full max-w-sm">
          <h1 className="text-lg font-semibold">Can&apos;t reach Supabase</h1>
          <p className="mt-2 text-sm text-neutral-500">
            {checkError}
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            Check that <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            and <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            are set (see <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">.env.example</code>) and that
            your Supabase project is running, then reload this page.
          </p>
          <Button className="mt-4 w-full" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-lg font-semibold">Admin login</h1>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Field label="Email">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
