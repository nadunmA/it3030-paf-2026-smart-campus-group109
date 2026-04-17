export default function ProfileEditPanel({
  profileName,
  setProfileName,
  saveProfileChanges,
  profileSaving,
  cancelProfileEdit,
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 680,
        background: "#fff",
        border: "1px solid #E8ECF0",
        borderRadius: 14,
        padding: "18px 20px",
        marginBottom: 12,
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: "block",
            fontSize: 10,
            color: "#9CA3AF",
            fontWeight: 700,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Full Name
        </label>
        <input
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          maxLength={100}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #CBD5E1",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
            fontFamily: "inherit",
            color: "#111827",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={saveProfileChanges}
          disabled={profileSaving}
          style={{
            padding: "9px 16px",
            borderRadius: 10,
            border: "none",
            background: "#2563EB",
            color: "#fff",
            fontWeight: 700,
            fontSize: 12,
            cursor: profileSaving ? "not-allowed" : "pointer",
            opacity: profileSaving ? 0.7 : 1,
            fontFamily: "inherit",
          }}
        >
          {profileSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={cancelProfileEdit}
          disabled={profileSaving}
          style={{
            padding: "9px 16px",
            borderRadius: 10,
            border: "1px solid #CBD5E1",
            background: "#fff",
            color: "#475569",
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
