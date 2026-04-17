import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiDelete, apiGet, apiPut } from "../../../lib/api";

const S = {
  page: {
    minHeight: "100vh",
    background: "#F0F2F5",
    padding: "28px max(16px,3vw)",
    fontFamily:
      "'SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
    colorScheme: "light",
  },
  inner: { maxWidth: 680, margin: "0 auto" },

  backBtn: {
    marginBottom: 16,
    background: "#fff",
    border: "1px solid #E2E8F0",
    color: "#475569",
    borderRadius: 10,
    padding: "7px 13px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },

  mainCard: {
    background: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,.08)",
    marginBottom: 14,
  },

  heroBanner: {
    height: 130,
    background: "linear-gradient(135deg,#0f2854 0%,#1a4fd6 55%,#6d28d9 100%)",
  },

  avatarRow: {
    padding: "0 22px 0",
    marginTop: -38,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  avatarWrap: { position: "relative", display: "inline-block" },

  avatarCircle: (pic) => ({
    width: 72,
    height: 72,
    borderRadius: "50%",
    border: "3px solid #fff",
    background: pic ? "transparent" : "#DBEAFE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 700,
    color: "#1e40af",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,.12)",
  }),

  onlineDot: {
    width: 13,
    height: 13,
    background: "#22c55e",
    borderRadius: "50%",
    border: "2.5px solid #fff",
    position: "absolute",
    bottom: 4,
    right: 2,
  },

  editProfileBtn: {
    background: "#fff",
    border: "1.5px solid #E2E8F0",
    color: "#374151",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 6,
  },

  profileInfo: { padding: "10px 22px 18px" },

  userName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 2px",
  },

  userEmail: { fontSize: 13, color: "#6B7280", margin: 0 },

  badgeRow: { display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" },

  badge: (bg, color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: bg,
    color: color,
    borderRadius: 20,
    padding: "4px 11px",
    fontSize: 12,
    fontWeight: 600,
    border: `1px solid ${color}33`,
  }),

  divider: { height: 1, background: "#F1F5F9", margin: "0 22px" },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    padding: "16px 22px",
    gap: 0,
  },

  statItem: (borderRight) => ({
    textAlign: "center",
    padding: "6px 0",
    borderRight: borderRight ? "1px solid #F1F5F9" : "none",
  }),

  statNum: (color) => ({
    fontSize: 28,
    fontWeight: 800,
    color,
    letterSpacing: "-.03em",
    lineHeight: 1,
  }),

  statLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    fontWeight: 700,
    marginTop: 4,
  },

  fieldsSection: { padding: "16px 22px 20px" },

  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  fieldCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    border: "1px solid #F1F5F9",
    borderRadius: 14,
    background: "#FAFBFC",
  },

  fieldIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#F1F5F9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  },

  fieldLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase",
    marginBottom: 3,
  },

  fieldValue: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  sectionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    padding: "0 22px 22px",
  },

  sectionCard: {
    border: "1px solid #F1F5F9",
    borderRadius: 14,
    padding: "14px 16px",
    background: "#fff",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: 800,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: ".06em",
  },

  sectionAction: {
    fontSize: 12,
    color: "#2563EB",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
    padding: 0,
  },

  bookingItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "9px 0",
    borderBottom: "1px solid #F8FAFC",
  },

  bookingName: { fontSize: 13, fontWeight: 700, color: "#111827" },
  bookingMeta: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

  statusPill: (status) => {
    const map = {
      APPROVED: { bg: "#F0FDF4", color: "#166534" },
      PENDING: { bg: "#FFFBEB", color: "#92400E" },
      REJECTED: { bg: "#FEF2F2", color: "#991B1B" },
    };
    const s = map[status] || { bg: "#F1F5F9", color: "#475569" };
    return {
      fontSize: 10,
      fontWeight: 700,
      padding: "3px 9px",
      borderRadius: 20,
      background: s.bg,
      color: s.color,
      textTransform: "uppercase",
      letterSpacing: ".04em",
      whiteSpace: "nowrap",
    };
  },

  notifItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "8px 0",
    borderBottom: "1px solid #F8FAFC",
  },

  notifDot: (color) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
    marginTop: 5,
  }),

  notifText: { fontSize: 13, color: "#374151", lineHeight: 1.4 },
  notifTime: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

  dangerCard: {
    background: "#fff",
    border: "1px solid #FECACA",
    borderRadius: 20,
    padding: "18px 22px",
    boxShadow: "0 1px 3px rgba(0,0,0,.06)",
  },

  dangerTitle: {
    margin: "0 0 5px",
    color: "#DC2626",
    fontSize: 15,
    fontWeight: 700,
  },

  dangerDesc: { margin: "0 0 14px", color: "#6B7280", fontSize: 13 },

  deactivateBtn: (disabled) => ({
    background: disabled ? "#FCA5A5" : "#DC2626",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
  }),

  // Edit form
  formSection: { padding: "20px 22px" },
  formLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: ".06em",
  },
  formInput: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #E2E8F0",
    borderRadius: 10,
    padding: "10px 12px",
    marginBottom: 14,
    fontSize: 14,
    background: "#fff",
    color: "#111827",
    outline: "none",
    fontFamily: "inherit",
  },
  saveBtn: (disabled) => ({
    background: disabled ? "#93C5FD" : "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
  }),
  cancelBtn: {
    background: "#fff",
    color: "#475569",
    border: "1px solid #E2E8F0",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  alertBox: (type) => ({
    marginBottom: 12,
    background: type === "error" ? "#FEF2F2" : "#ECFDF5",
    border: `1px solid ${type === "error" ? "#FECACA" : "#A7F3D0"}`,
    color: type === "error" ? "#B91C1C" : "#065F46",
    borderRadius: 10,
    padding: "9px 12px",
    fontSize: 12,
  }),
};

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UserProfilePage() {
  const navigate = useNavigate();

  const sessionUser = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [user, setUser] = useState(sessionUser);
  const [name, setName] = useState(sessionUser?.name || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]);
  const [myNotifications, setMyNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const role = (user?.role || sessionUser?.role || "USER").toUpperCase();
  const backPath =
    role === "ADMIN"
      ? "/admin/dashboard"
      : role === "TECHNICIAN"
        ? "/technician/dashboard"
        : "/dashboard";
  const roleStyles = {
    USER: { bg: "#EFF6FF", color: "#1D4ED8", dot: "#2563EB", label: "USER" },
    ADMIN: { bg: "#FEF2F2", color: "#DC2626", dot: "#DC2626", label: "ADMIN" },
    TECHNICIAN: {
      bg: "#F5F3FF",
      color: "#7C3AED",
      dot: "#7C3AED",
      label: "TECHNICIAN",
    },
  };
  const roleBadge = roleStyles[role] || roleStyles.USER;

  useEffect(() => {
    if (!sessionUser) {
      navigate("/");
      return;
    }
    const fetchMe = async () => {
      try {
        setLoading(true);
        setError("");
        const me = await apiGet("/auth/me");
        setUser(me);
        setName(me?.name || "");
        sessionStorage.setItem("user", JSON.stringify(me));
      } catch (e) {
        console.error(e);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [navigate, sessionUser]);

  useEffect(() => {
    if (!sessionUser) return;
    const fetchInsights = async () => {
      try {
        setInsightsLoading(true);
        const [bookingsRes, notificationsRes] = await Promise.all([
          apiGet("/bookings/me"),
          apiGet("/notifications/my"),
        ]);
        const bookings = Array.isArray(bookingsRes) ? bookingsRes : [];
        const notifications = Array.isArray(notificationsRes?.notifications)
          ? notificationsRes.notifications
          : [];
        setMyBookings(bookings);
        setMyNotifications(notifications);
        setUnreadNotifications(
          typeof notificationsRes?.unreadCount === "number"
            ? notificationsRes.unreadCount
            : notifications.filter((n) => !n.read).length,
        );
      } catch (e) {
        console.error(e);
        setMyBookings([]);
        setMyNotifications([]);
        setUnreadNotifications(0);
      } finally {
        setInsightsLoading(false);
      }
    };
    fetchInsights();
  }, [sessionUser]);

  const bookingStats = useMemo(
    () => ({
      total: myBookings.length,
      approved: myBookings.filter((b) => b.status === "APPROVED").length,
      pending: myBookings.filter((b) => b.status === "PENDING").length,
    }),
    [myBookings],
  );

  const recentBookings = useMemo(
    () =>
      [...myBookings]
        .sort(
          (a, b) =>
            new Date(b?.createdAt || b?.updatedAt || 0) -
            new Date(a?.createdAt || a?.updatedAt || 0),
        )
        .slice(0, 3),
    [myBookings],
  );

  const recentNotifications = useMemo(
    () =>
      [...myNotifications]
        .sort(
          (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0),
        )
        .slice(0, 3),
    [myNotifications],
  );

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await apiPut("/auth/me", {
        name: name.trim(),
      });
      setUser(updated);
      setName(updated?.name || "");
      sessionStorage.setItem("user", JSON.stringify(updated));
      setSuccess("Profile updated successfully.");
      setIsEditMode(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const onDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account?"))
      return;
    setDeleting(true);
    setError("");
    try {
      await apiDelete("/auth/me");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to deactivate account.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          ...S.page,
          display: "grid",
          placeItems: "center",
          color: "#6B7280",
        }}
      >
        Loading profile...
      </div>
    );
  }

  const displayPic = user?.picture;
  const initials = getInitials(user?.name);

  return (
    <div style={S.page}>
      <div style={S.inner}>
        {/* Back button */}
        <button onClick={() => navigate(backPath)} style={S.backBtn}>
          ‹ Back to Dashboard
        </button>

        {/* Main card */}
        <div style={S.mainCard}>
          {/* Hero banner */}
          <div style={S.heroBanner} />

          {/* Avatar + Edit button row */}
          <div style={S.avatarRow}>
            <div style={S.avatarWrap}>
              <div style={S.avatarCircle(displayPic, user?.name)}>
                {displayPic ? (
                  <img
                    src={displayPic}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  initials
                )}
              </div>
              <div style={S.onlineDot} />
            </div>
            {!isEditMode && (
              <button
                style={S.editProfileBtn}
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setName(user?.name || "");
                  setIsEditMode(true);
                }}
              >
                Edit profile
              </button>
            )}
          </div>

          {/* Name / email / badges */}
          <div style={S.profileInfo}>
            <p style={S.userName}>{user?.name || "User"}</p>
            <p style={S.userEmail}>{user?.email}</p>
            <div style={S.badgeRow}>
              <span style={S.badge(roleBadge.bg, roleBadge.color)}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: roleBadge.dot,
                    display: "inline-block",
                  }}
                />
                {roleBadge.label}
              </span>
              <span style={S.badge("#F0FDF4", "#166534")}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                  }}
                />
                Active
              </span>
              <span style={S.badge("#F8FAFC", "#475569")}>
                Google OAuth 2.0
              </span>
            </div>
          </div>

          <div style={S.divider} />

          {/* Stats row */}
          <div style={S.statsRow}>
            {[
              {
                label: "Bookings",
                value: bookingStats.total,
                color: "#2563EB",
              },
              {
                label: "Approved",
                value: bookingStats.approved,
                color: "#059669",
              },
              {
                label: "Pending",
                value: bookingStats.pending,
                color: "#D97706",
              },
              { label: "Unread", value: unreadNotifications, color: "#7C3AED" },
            ].map((s, i) => (
              <div key={s.label} style={S.statItem(i < 3)}>
                <div style={S.statNum(s.color)}>
                  {insightsLoading ? "·" : s.value}
                </div>
                <div style={S.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={S.divider} />

          {/* View mode */}
          {!isEditMode && (
            <>
              {/* Field cards */}
              <div style={S.fieldsSection}>
                <div style={S.fieldsGrid}>
                  {[
                    {
                      label: "Full Name",
                      value: user?.name || "-",
                      icon: "👤",
                    },
                    { label: "Email", value: user?.email || "-", icon: "✉️" },
                    { label: "Role", value: user?.role || "USER", icon: "🔑" },
                    {
                      label: "Auth Method",
                      value: "Google OAuth 2.0",
                      icon: "🔒",
                    },
                  ].map((field) => (
                    <div key={field.label} style={S.fieldCard}>
                      <span style={S.fieldIcon}>{field.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={S.fieldLabel}>{field.label}</div>
                        <div style={S.fieldValue}>{field.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={S.divider} />

              {/* Recent bookings + notifications */}
              <div style={S.sectionsGrid}>
                {/* Bookings */}
                <div style={S.sectionCard}>
                  <div style={S.sectionHeader}>
                    <span style={S.sectionTitle}>Recent Bookings</span>
                    <button
                      style={S.sectionAction}
                      onClick={() => navigate("/bookings")}
                    >
                      View all →
                    </button>
                  </div>
                  {insightsLoading ? (
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      Loading...
                    </div>
                  ) : recentBookings.length === 0 ? (
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      No bookings found.
                    </div>
                  ) : (
                    recentBookings.map((booking) => (
                      <div key={booking.id} style={S.bookingItem}>
                        <div>
                          <div style={S.bookingName}>
                            {booking.resourceName ||
                              booking.resourceType ||
                              "Resource"}
                          </div>
                          <div style={S.bookingMeta}>
                            {booking.resourceLocation
                              ? `${booking.resourceLocation} · `
                              : ""}
                            {booking.bookingDate || "No date"}
                          </div>
                        </div>
                        <span style={S.statusPill(booking.status)}>
                          {booking.status || "UNKNOWN"}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Notifications */}
                <div style={S.sectionCard}>
                  <div style={S.sectionHeader}>
                    <span style={S.sectionTitle}>Notifications</span>
                    <button style={S.sectionAction}>Mark all read</button>
                  </div>
                  {insightsLoading ? (
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      Loading...
                    </div>
                  ) : recentNotifications.length === 0 ? (
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      No notifications.
                    </div>
                  ) : (
                    recentNotifications.map((notif, i) => {
                      const dotColors = ["#2563EB", "#D97706", "#9CA3AF"];
                      return (
                        <div key={notif.id} style={S.notifItem}>
                          <div
                            style={S.notifDot(
                              notif.read
                                ? "#9CA3AF"
                                : dotColors[i % dotColors.length],
                            )}
                          />
                          <div>
                            <div style={S.notifText}>
                              {notif.title ||
                                notif.message ||
                                notif.type ||
                                "Notification"}
                            </div>
                            <div style={S.notifTime}>
                              {notif.timeAgo || notif.createdAt || ""}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {/* Edit mode form */}
          {isEditMode && (
            <form onSubmit={onSave} style={S.formSection}>
              <label style={S.formLabel}>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                style={S.formInput}
              />

              {error && <div style={S.alertBox("error")}>{error}</div>}
              {success && <div style={S.alertBox("success")}>{success}</div>}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={S.saveBtn(saving)}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  style={S.cancelBtn}
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setName(user?.name || "");
                    setIsEditMode(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Danger zone */}
        <div style={S.dangerCard}>
          <h2 style={S.dangerTitle}>Danger zone</h2>
          <p style={S.dangerDesc}>
            Deactivating your account will mark it as inactive. Contact an
            administrator to restore access.
          </p>
          {error && isEditMode === false && (
            <div style={{ ...S.alertBox("error"), marginBottom: 12 }}>
              {error}
            </div>
          )}
          <button
            type="button"
            onClick={onDeactivate}
            disabled={deleting}
            style={S.deactivateBtn(deleting)}
          >
            {deleting ? "Deactivating..." : "Deactivate Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
