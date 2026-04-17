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
        maxWidth: 740,
        background: "#fff",
        border: "1px solid #E8EBF0",
        borderRadius: 14,
        padding: "18px 20px",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 8,
        }}
      >
        <label
          style={{
            fontSize: 11,
            color: "#64748B",
            fontWeight: 700,
            letterSpacing: ".04em",
            textTransform: "uppercase",
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
            padding: "10px 11px",
            fontSize: 13,
            fontFamily: "inherit",
          }}
        />
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={saveProfileChanges}
          disabled={profileSaving}
          style={{
            padding: "9px 14px",
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
            padding: "9px 14px",
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
