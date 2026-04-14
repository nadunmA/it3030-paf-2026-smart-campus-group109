import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../../lib/api";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      const res = await apiGet("/notifications/my");
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setError("Failed to load notifications.");
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await apiGet("/notifications/my");
        if (cancelled) return;
        setNotifications(res.notifications ?? []);
        setUnreadCount(res.unreadCount ?? 0);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load notifications", err);
        setError("Failed to load notifications.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async () => {
    try {
      setError("");
      await apiPost("/notifications/my", {
        title: title.trim(),
        message: message.trim(),
      });
      setTitle("");
      setMessage("");
      await loadNotifications();
    } catch (err) {
      console.error("Failed to create notification", err);
      setError("Failed to create notification.");
    }
  };

  const handleUpdate = async (notification) => {
    try {
      setError("");
      await apiPut(`/notifications/${notification.id}`, {
        title: notification.title,
        message: notification.message,
        read: notification.read,
      });
      setEditingId("");
      await loadNotifications();
    } catch (err) {
      console.error("Failed to update notification", err);
      setError("Failed to update notification.");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await apiDelete(`/notifications/${id}`);
      await loadNotifications();
    } catch (err) {
      console.error("Failed to delete notification", err);
      setError("Failed to delete notification.");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      setError("");
      await apiPatch(`/notifications/${id}/read`, {});
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      setError("Failed to mark notification as read.");
    }
  };

  const onFieldChange = (id, field, value) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)),
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h3>Notifications ({unreadCount})</h3>

      <div
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
          background: "#F9FAFB",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          Create Notification
        </div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
          rows={3}
        />
        <button onClick={handleCreate}>Create (POST)</button>
      </div>

      {error && (
        <div style={{ color: "#B91C1C", marginBottom: 12, fontSize: 13 }}>
          {error}
        </div>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            padding: 12,
            marginBottom: 10,
            background: n.read ? "#fff" : "#EFF6FF",
          }}
        >
          {editingId === n.id ? (
            <>
              <input
                value={n.title || ""}
                onChange={(e) => onFieldChange(n.id, "title", e.target.value)}
                style={{ width: "100%", marginBottom: 8, padding: 8 }}
              />
              <textarea
                value={n.message || ""}
                onChange={(e) => onFieldChange(n.id, "message", e.target.value)}
                rows={2}
                style={{ width: "100%", marginBottom: 8, padding: 8 }}
              />
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700 }}>{n.title}</div>
              <div style={{ marginTop: 4 }}>{n.message}</div>
            </>
          )}

          <div
            style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            {editingId === n.id ? (
              <>
                <button onClick={() => handleUpdate(n)}>Save (PUT)</button>
                <button onClick={() => setEditingId("")}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditingId(n.id)}>Edit (PUT)</button>
            )}

            {!n.read && (
              <button onClick={() => handleMarkRead(n.id)}>Mark Read</button>
            )}
            <button onClick={() => handleDelete(n.id)}>Delete (DELETE)</button>
          </div>
        </div>
      ))}
    </div>
  );
}
