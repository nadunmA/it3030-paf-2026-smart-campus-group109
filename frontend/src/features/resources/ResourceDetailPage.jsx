import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiDelete, apiGet } from "../../lib/api";
import StatusBadge from "./StatusBadge";
import ResourceFormModal from "./ResourceFormModal";

const C = {
  bg: "#F5F7FA",
  surface: "#fff",
  border: "#E8EBF0",
  text: "#1A1D23",
  muted: "#6B7280",
  blue: "#2563EB",
  red: "#DC2626",
};

function readUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = readUser();
  const isAdmin = user?.role === "ADMIN";
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiGet(`/resources/${id}`)
      .then((data) => {
        if (active) setResource(data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load resource");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this resource?")) return;
    await apiDelete(`/resources/${id}`);
    navigate("/resources");
  };

  if (loading) {
    return <div style={{ padding: 24, color: C.muted }}>Loading resource...</div>;
  }

  if (error || !resource) {
    return <div style={{ padding: 24, color: C.red }}>{error || "Resource not found"}</div>;
  }

  const rows = [
    ["Type", resource.type || resource.resourceTypeName],
    ["Description", resource.description || "—"],
    ["Location", resource.location || "—"],
    ["Capacity", resource.capacity ?? "—"],
    ["Availability Start", resource.availabilityStart || "—"],
    ["Availability End", resource.availabilityEnd || "—"],
    ["Status", resource.status || "—"],
    ["Availability", resource.availability || "—"],
    ["Condition", resource.condition || "—"],
    ["Serial Number", resource.serialNumber || "—"],
    ["Assigned Technician", resource.assignedTechnicianName || resource.assignedTechnicianId || "—"],
    ["QR Code", resource.qrCode || "—"],
    ["Created At", resource.createdAt || "—"],
    ["Updated At", resource.updatedAt || "—"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <button onClick={() => navigate("/resources")} style={{ border: "none", background: "transparent", color: C.blue, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
          ← Back to resource list
        </button>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24, boxShadow: "0 20px 50px rgba(15,23,42,.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-.05em", color: C.text }}>{resource.name}</div>
              <div style={{ color: C.muted, marginTop: 6 }}>{resource.resourceTypeName}</div>
            </div>
            <StatusBadge status={resource.status} availability={resource.availability} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            {rows.map(([label, value]) => (
              <div key={label} style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, background: "#FAFBFC" }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: C.muted, fontWeight: 700, marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>{label === "Status" ? <StatusBadge status={value} /> : String(value)}</div>
              </div>
            ))}
          </div>

          {resource.qrCode && (
            <div style={{ marginTop: 16, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, background: "#FAFBFC", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(resource.qrCode)}`}
                alt="Resource QR"
                width={140}
                height={140}
                style={{ borderRadius: 10, border: `1px solid ${C.border}`, background: "#fff" }}
              />
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: C.muted, fontWeight: 700, marginBottom: 6 }}>QR Check-In Code</div>
                <div style={{ color: C.text, fontWeight: 700 }}>{resource.qrCode}</div>
                <div style={{ marginTop: 8, color: C.muted, fontSize: 13 }}>
                  Use this code in the Resource Catalogue QR Lookup to open this resource quickly.
                </div>
              </div>
            </div>
          )}

          {isAdmin && (
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setEditing(true)} style={{ border: "1px solid #BFDBFE", background: "#EFF6FF", color: C.blue, borderRadius: 14, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
                Edit Resource
              </button>
              <button onClick={handleDelete} style={{ border: "1px solid #FECACA", background: "#FEF2F2", color: C.red, borderRadius: 14, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
                Delete Resource
              </button>
            </div>
          )}
        </div>
      </div>

      {isAdmin && editing && (
        <ResourceFormModal
          isOpen={editing}
          resource={resource}
          onClose={() => setEditing(false)}
          onSaved={async () => {
            const updated = await apiGet(`/resources/${id}`);
            setResource(updated);
          }}
        />
      )}
    </div>
  );
}
