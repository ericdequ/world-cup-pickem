import { AccountCard } from "./AccountCard";
import { FavoriteTeamCard } from "./FavoriteTeamCard";
import { NotificationsCard } from "./NotificationsCard";

export function ProfilePanel() {
  return (
    <div className="flex flex-col gap-4">
      <AccountCard />
      <FavoriteTeamCard />
      <NotificationsCard />
    </div>
  );
}
