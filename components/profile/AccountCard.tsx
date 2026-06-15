"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";

export function AccountCard() {
  const { user, configured, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      await signInWithEmail(email.trim());
      setSent(true);
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <Card className="p-5">
      <h2 className="mb-1 text-[13px] font-bold uppercase tracking-[0.15em] text-gold">Account</h2>

      {!configured && (
        <p className="text-[13px] text-muted">
          Running in <span className="text-cream">local mode</span> — your picks are saved on this
          device. Add Supabase keys to enable accounts + cloud sync across devices.
        </p>
      )}

      {configured && user && (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold text-cream">{user.email}</div>
            <div className="text-[12px] text-green-400">✓ Signed in · synced</div>
          </div>
          <Button variant="ghost" onClick={signOut} className="shrink-0">
            Sign out
          </Button>
        </div>
      )}

      {configured && !user && !sent && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] text-muted">
            Sign in to save your predictions to your account and play the global pool.
          </p>
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
          <Button onClick={submit} disabled={!email.includes("@")}>
            Send magic link
          </Button>
          {error && <p className="text-[12px] text-red-400">{error}</p>}
        </div>
      )}

      {configured && !user && sent && (
        <p className="text-[13px] text-green-400">
          ✓ Check your email for a sign-in link.
        </p>
      )}
    </Card>
  );
}
