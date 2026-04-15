import { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../../lib/api";

export default function NotificationPreferencesPanel({ onClose }) {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const res = await apiGet("/notifications/preferences/my");
      setPrefs(res);
    } catch (e) {
      console.error("Failed to fetch preferences", e);
      setError("Failed to load preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await apiPost("/notifications/preferences/my", prefs);
      setSuccess("Preferences saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      console.error("Failed to save preferences", e);
      setError("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      window.confirm(
        "Reset all notification preferences to defaults? This cannot be undone.",
      )
    ) {
      try {
        setSaving(true);
        setError("");
        const res = await apiPost("/notifications/preferences/my/reset", {});
        setPrefs(res);
        setSuccess("Preferences reset to defaults!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (e) {
        console.error("Failed to reset preferences", e);
        setError("Failed to reset preferences");
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#9CA3AF" }}>
        Loading preferences...
      </div>
    );
  }

  if (!prefs) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#DC2626" }}>
        Failed to load preferences
      </div>
    );
  }

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#1A1D23",
          textTransform: "uppercase",
          letterSpacing: ".07em",
          marginBottom: 12,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );

  const Toggle = ({ label, checked, onChange }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #E8EBF0",
      }}
    >
      <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: 18,
          height: 18,
          cursor: "pointer",
          accentColor: "#2563EB",
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        maxHeight: "80vh",
        overflowY: "auto",
        padding: "24px",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 10px 40px rgba(0,0,0,.1)",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1A1D23",
            margin: "0 0 6px",
          }}
        >
          Notification Preferences
        </h2>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
          Customize how and when you receive notifications
        </p>
      </div>

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            color: "#DC2626",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            background: "#ECFDF5",
            border: "1px solid #A7F3D0",
            borderRadius: 8,
            color: "#059669",
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <Section title="📧 Email Notifications">
          <Toggle
            label="Enable all email notifications"
            checked={prefs.emailNotificationsEnabled}
            onChange={(val) =>
              setPrefs({ ...prefs, emailNotificationsEnabled: val })
            }
          />
          {prefs.emailNotificationsEnabled && (
            <>
              <Toggle
                label="Booking notifications"
                checked={prefs.emailBookingNotifications}
                onChange={(val) =>
                  setPrefs({ ...prefs, emailBookingNotifications: val })
                }
              />
              <Toggle
                label="Ticket notifications"
                checked={prefs.emailTicketNotifications}
                onChange={(val) =>
                  setPrefs({ ...prefs, emailTicketNotifications: val })
                }
              />
              <Toggle
                label="Comment notifications"
                checked={prefs.emailCommentNotifications}
                onChange={(val) =>
                  setPrefs({ ...prefs, emailCommentNotifications: val })
                }
              />
            </>
          )}
        </Section>

        <Section title="🔔 In-App Notifications">
          <Toggle
            label="Enable all in-app notifications"
            checked={prefs.inAppNotificationsEnabled}
            onChange={(val) =>
              setPrefs({ ...prefs, inAppNotificationsEnabled: val })
            }
          />
          {prefs.inAppNotificationsEnabled && (
            <>
              <Toggle
                label="Booking notifications"
                checked={prefs.inAppBookingNotifications}
                onChange={(val) =>
                  setPrefs({ ...prefs, inAppBookingNotifications: val })
                }
              />
              <Toggle
                label="Ticket notifications"
                checked={prefs.inAppTicketNotifications}
                onChange={(val) =>
                  setPrefs({ ...prefs, inAppTicketNotifications: val })
                }
              />
              <Toggle
                label="Comment notifications"
                checked={prefs.inAppCommentNotifications}
                onChange={(val) =>
                  setPrefs({ ...prefs, inAppCommentNotifications: val })
                }
              />
            </>
          )}
        </Section>

        <Section title="🌙 Quiet Hours">
          <Toggle
            label="Enable quiet hours"
            checked={prefs.quietHoursEnabled}
            onChange={(val) => setPrefs({ ...prefs, quietHoursEnabled: val })}
          />
          {prefs.quietHoursEnabled && (
            <div style={{ marginTop: 12, paddingTop: 12 }}>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    From (hour)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={prefs.quietHoursStart || ""}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        quietHoursStart: parseInt(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: 12,
                      border: "1px solid #E5E7EB",
                      borderRadius: 8,
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#6B7280",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    To (hour)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={prefs.quietHoursEnd || ""}
                    onChange={(e) =>
                      setPrefs({
                        ...prefs,
                        quietHoursEnd: parseInt(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: 12,
                      border: "1px solid #E5E7EB",
                      borderRadius: 8,
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                No notifications between {prefs.quietHoursStart}:00 and{" "}
                {prefs.quietHoursEnd}:00
              </p>
            </div>
          )}
        </Section>

        <Section title="🗑️ Notification Retention">
          <Toggle
            label="Auto-delete old notifications"
            checked={prefs.autoDeleteOldNotifications}
            onChange={(val) =>
              setPrefs({ ...prefs, autoDeleteOldNotifications: val })
            }
          />
          {prefs.autoDeleteOldNotifications && (
            <div style={{ marginTop: 12, paddingTop: 12 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#6B7280",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Keep notifications for (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={prefs.notificationRetentionDays || ""}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    notificationRetentionDays: parseInt(e.target.value),
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: 12,
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}
        </Section>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#2563EB",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            opacity: saving ? 0.6 : 1,
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            if (!saving) e.currentTarget.style.background = "#1D4ED8";
          }}
          onMouseLeave={(e) => {
            if (!saving) e.currentTarget.style.background = "#2563EB";
          }}
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: "12px 16px",
            background: "#F3F4F6",
            color: "#6B7280",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E5E7EB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#F3F4F6";
          }}
        >
          Reset to Defaults
        </button>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: "12px 16px",
              background: "#fff",
              color: "#6B7280",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.color = "#1A1D23";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
