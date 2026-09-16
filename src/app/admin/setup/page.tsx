"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.rpc("has_admin").then(({ data }) => {
      if (data) {
        router.replace("/admin/login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      const { data: claimed, error: claimError } = await supabase.rpc("claim_admin");
      if (claimError || !claimed) {
        setError(claimError?.message ?? "Could not set up admin account. It may already exist.");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      return;
    }

    setNeedsConfirmation(true);
    setLoading(false);
  }

  if (checking) return null;

  if (needsConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
        <Card className="w-full max-w-sm text-center">
          <h1 className="text-lg font-semibold">Check your email</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Confirm your email address, then sign in — your account becomes the site admin
            automatically on first login.
          </p>
          <Button className="mt-4 w-full" onClick={() => router.replace("/admin/login")}>
            Go to login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-lg font-semibold">Set up your admin account</h1>
        <p className="mt-1 text-sm text-neutral-500">
          This is a one-time step to create the owner account for this site's dashboard.
        </p>
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Field>
          <Field label="Confirm password">
            <Input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create admin account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
