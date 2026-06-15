import { AccountCard } from "./AccountCard";
import { FavoriteTeamCard } from "./FavoriteTeamCard";
import { NotificationsCard } from "./NotificationsCard";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export function ProfilePanel() {
  return (
    <div className="flex flex-col gap-4">
      <AccountCard />
      <FavoriteTeamCard />
      <NotificationsCard />
      <LanguageSwitcher />
    </div>
  );
}
