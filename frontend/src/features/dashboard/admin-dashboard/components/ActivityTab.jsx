import { C } from "./AdminUi";

export default function ActivityTab({ activity, loadError }) {
  const pgTitle = {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-.04em",
    color: C.text,
    marginBottom: 6,
  };
  const pgSub = { fontSize: 13, color: C.muted, marginBottom: 24 };

  return (
    <div>
      <div style={pgTitle}>Activity Log</div>
      <div style={pgSub}>Full audit trail of all system events</div>
      {loadError && (
        <div
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: C.red,
            background: C.redBg,
            border: `1px solid ${C.redBd}`,
            borderRadius: 8,
            padding: "8px 10px",
          }}
        >
          {loadError}
        </div>
      )}
      {activity.map((a, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 14px",
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            marginBottom: 7,
            cursor: "pointer",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#CBD5E1";
            e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: a.color || C.blue,
              flexShrink: 0,
            }}
          />
          <span style={{ flex: 1, fontSize: 13, color: C.text }}>
            {a.text || "Activity entry"}
          </span>
          <span style={{ fontSize: 11, color: C.hint, flexShrink: 0 }}>
            {a.time || "now"}
          </span>
        </div>
      ))}
    </div>
  );
}
