"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile CAPTCHA — privacy-friendly anti-bot for the sign-in form.
 * Renders only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set; otherwise nothing
 * shows and sign-in proceeds without a token (configure it in Supabase →
 * Auth → Attack Protection to enforce server-side).
 */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

interface TurnstileApi {
  render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void }) => string;
}

function loadScript(): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

export function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    let cancelled = false;
    loadScript().then(() => {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (cancelled || !api || !ref.current) return;
      api.render(ref.current, { sitekey: SITE_KEY, callback: onVerify });
    });
    return () => {
      cancelled = true;
    };
  }, [onVerify]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="my-1" />;
}

/** Whether CAPTCHA is required (site key configured). */
export const captchaRequired = Boolean(SITE_KEY);
