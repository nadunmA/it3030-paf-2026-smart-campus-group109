import ProfileEditPanel from "../components/ProfileEditPanel";
import ProfileSummaryCard from "../components/ProfileSummaryCard";

export default function ProfileTab({
  user,
  isProfileEditing,
  startProfileEdit,
  profileNotice,
  profileName,
  setProfileName,
  saveProfileChanges,
  profileSaving,
  cancelProfileEdit,
  totalBookingsCount,
  approvedBookingsCount,
  pendingBookingsCount,
  unreadCount,
  handleLogout,
  handleSuspendAccount,
  suspendBusy,
  suspendError,
}) {
  const statCards = [
    { label: "Bookings", value: totalBookingsCount, color: "#2563EB" },
    { label: "Approved", value: approvedBookingsCount, color: "#059669" },
    { label: "Pending", value: pendingBookingsCount, color: "#D97706" },
    { label: "Unread", value: unreadCount, color: "#7C3AED" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 8,
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-.03em",
              color: "#111827",
              marginBottom: 3,
            }}
          >
            Profile
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
            Your account details and activity summary
          </div>
        </div>
        {!isProfileEditing && (
          <button
            onClick={startProfileEdit}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #BFDBFE",
              background: "#EFF6FF",
              color: "#2563EB",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Notice banner */}
      {profileNotice.text && (
        <div
          style={{
            width: "100%",
            maxWidth: 680,
            marginBottom: 12,
            fontSize: 12,
            borderRadius: 10,
            padding: "9px 12px",
            background:
              profileNotice.type === "success" ? "#ECFDF5" : "#FEF2F2",
            border:
              profileNotice.type === "success"
                ? "1px solid #A7F3D0"
                : "1px solid #FECACA",
            color: profileNotice.type === "success" ? "#065F46" : "#B91C1C",
          }}
        >
          {profileNotice.text}
        </div>
      )}

      {/* Edit panel */}
      {isProfileEditing && (
        <ProfileEditPanel
          profileName={profileName}
          setProfileName={setProfileName}
          saveProfileChanges={saveProfileChanges}
          profileSaving={profileSaving}
          cancelProfileEdit={cancelProfileEdit}
        />
      )}

      {/* Profile hero card */}
      <ProfileSummaryCard user={user} />

      {/* Activity stats */}
      <div style={{ width: "100%", maxWidth: 680, marginBottom: 16 }}>
        <div
          style={{
            fontSize: 10,
            color: "#9CA3AF",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".08em",
            marginBottom: 8,
          }}
        >
          Activity
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 10,
          }}
        >
          {statCards.map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                border: "1px solid #E8ECF0",
                borderRadius: 13,
                padding: "16px 10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: s.color,
                  letterSpacing: "-.04em",
                  marginBottom: 3,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#9CA3AF",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          height: 1,
          background: "#E8ECF0",
          marginBottom: 16,
        }}
      />

      {/* Action buttons */}
      <div style={{ width: "100%", maxWidth: 680 }}>
        {suspendError && (
          <div
            style={{
              marginBottom: 10,
              fontSize: 12,
              borderRadius: 10,
              padding: "9px 12px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#B91C1C",
            }}
          >
            {suspendError}
          </div>
        )}
        <button
          onClick={handleSuspendAccount}
          disabled={suspendBusy}
          style={{
            width: "100%",
            marginBottom: 8,
            padding: 13,
            borderRadius: 22,
            background: suspendBusy ? "#FEE2E2" : "#DC2626",
            border: "none",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: suspendBusy ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: suspendBusy ? 0.85 : 1,
          }}
        >
          {suspendBusy ? "Suspending..." : "Suspend Account"}
        </button>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: 13,
            borderRadius: 22,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Sign out of SmartCampus
        </button>
      </div>
    </div>
  );
}
