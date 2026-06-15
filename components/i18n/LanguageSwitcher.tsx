"use client";

import { useTranslation } from "react-i18next";
import i18n, { LANGUAGES, STORAGE_KEY } from "@/lib/i18n/config";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const active = i18n.language;

  const choose = (code: string) => {
    localStorage.setItem(STORAGE_KEY, code);
    i18n.changeLanguage(code);
  };

  return (
    <Card className="p-5">
      <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.15em] text-gold">
        {t("profile.language")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => choose(lang.code)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors",
              active === lang.code
                ? "border-gold bg-gold/10 text-gold-light"
                : "border-pitch-border bg-pitch text-muted hover:text-cream",
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </Card>
  );
}
