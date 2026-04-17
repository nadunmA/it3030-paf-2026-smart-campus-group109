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
      <div
        style={{
          width: "100%",
          maxWidth: 740,
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-.03em",
              color: "#1A1D23",
              marginBottom: 6,
            }}
          >
            Profile
          </div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            Your account details and activity summary
          </div>
        </div>
        {!isProfileEditing && (
          <button
            onClick={startProfileEdit}
            style={{
              padding: "9px 14px",
              borderRadius: 10,
              border: "1px solid #BFDBFE",
              background: "#EFF6FF",
              color: "#2563EB",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {profileNotice.text && (
        <div
          style={{
            width: "100%",
            maxWidth: 740,
            marginBottom: 12,
            fontSize: 12,
            borderRadius: 10,
            padding: "9px 10px",
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

      {isProfileEditing && (
        <ProfileEditPanel
          profileName={profileName}
          setProfileName={setProfileName}
          saveProfileChanges={saveProfileChanges}
          profileSaving={profileSaving}
          cancelProfileEdit={cancelProfileEdit}
        />
      )}

      <div
        style={{
          width: "100%",
          maxWidth: 740,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "1px solid #E8EBF0",
              borderRadius: 13,
              padding: "18px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: s.color,
                letterSpacing: "-.04em",
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".05em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <ProfileSummaryCard user={user} />

      <div style={{ width: "100%", maxWidth: 740 }}>
        {suspendError && (
          <div
            style={{
              marginBottom: 10,
              fontSize: 12,
              borderRadius: 10,
              padding: "9px 10px",
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
            marginBottom: 10,
            padding: 13,
            borderRadius: 24,
            background: suspendBusy ? "#FEE2E2" : "#DC2626",
            border: "1px solid #DC2626",
            color: "#fff",
            fontSize: 14,
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
            borderRadius: 24,
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
            fontSize: 14,
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
