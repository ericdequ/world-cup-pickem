"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";
import { Turnstile, captchaRequired } from "@/components/security/Turnstile";

export function AccountCard() {
  const { t } = useTranslation();
  const { user, configured, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.includes("@") && (!captchaRequired || Boolean(captcha));

  const submit = async () => {
    setError(null);
    try {
      await signInWithEmail(email.trim(), captcha ?? undefined);
      setSent(true);
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <Card className="p-5">
      <h2 className="mb-1 text-[13px] font-bold uppercase tracking-[0.15em] text-gold">
        {t("profile.account")}
      </h2>

      {!configured && <p className="text-[13px] text-muted">{t("profile.localMode")}</p>}

      {configured && user && (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold text-cream">{user.email}</div>
            <div className="text-[12px] text-green-400">✓ {t("profile.signedIn")}</div>
          </div>
          <Button variant="ghost" onClick={signOut} className="shrink-0">
            {t("profile.signOut")}
          </Button>
        </div>
      )}

      {configured && !user && !sent && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] text-muted">{t("profile.signInPrompt")}</p>
          <TextInput
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("profile.email")}
          />
          <Turnstile onVerify={setCaptcha} />
          <Button onClick={submit} disabled={!canSubmit}>
            {t("profile.sendLink")}
          </Button>
          {error && <p className="text-[12px] text-red-400">{error}</p>}
        </div>
      )}

      {configured && !user && sent && (
        <p className="text-[13px] text-green-400">✓ {t("profile.linkSent")}</p>
      )}
    </Card>
  );
}
