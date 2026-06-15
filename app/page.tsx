"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Hero } from "@/components/layout/Hero";
import { BottomNav, type AppSection } from "@/components/layout/BottomNav";
import { PredictionsBoard } from "@/components/predictions/PredictionsBoard";
import { LineupDisplay } from "@/components/lineup/LineupDisplay";
import { PlayerResearch } from "@/components/players/PlayerResearch";
import { PoolPanel } from "@/components/pool/PoolPanel";
import { ProfilePanel } from "@/components/profile/ProfilePanel";

export default function Home() {
  const { t } = useTranslation();
  const [section, setSection] = useState<AppSection>("predict");

  return (
    <main className="min-h-screen bg-pitch pb-24">
      <Hero pot={0} />

      <div className="mx-auto max-w-[760px] px-4 pt-6">
        <h1 className="mb-4 text-xl font-bold text-cream">{t(`section.${section}`)}</h1>

        {section === "predict" && <PredictionsBoard />}
        {section === "lineups" && <LineupDisplay />}
        {section === "players" && <PlayerResearch />}
        {section === "pool" && <PoolPanel />}
        {section === "profile" && <ProfilePanel />}
      </div>

      <BottomNav active={section} onChange={setSection} />
    </main>
  );
}
