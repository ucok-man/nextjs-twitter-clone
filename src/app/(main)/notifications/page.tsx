import Header from "@/components/header";
import NotificationFeed from "./notification-feed";

export default function NotificationPage() {
  return (
    <div className="grow h-full">
      <Header showBackArrow>Notifications</Header>
      <NotificationFeed />
    </div>
  );
}
