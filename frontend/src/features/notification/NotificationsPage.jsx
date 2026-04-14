import { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await apiGet("/notifications/my");
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    loadNotifications();
  }, []);

  return (
    <div>
      <h3>Notifications ({unreadCount})</h3>
      {notifications.map((n) => (
        <div key={n.id}>
          {n.title} - {n.message}
        </div>
      ))}
    </div>
  );
}
