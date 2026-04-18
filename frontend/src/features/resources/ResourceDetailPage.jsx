import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiDelete, apiGet } from "../../lib/api";
import QRCode from "qrcode";
import ResourceAdminLayout from "./ResourceAdminLayout";
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

function normalizeTypeKey(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function buildResourceQrPayload(resource) {
  const qrValue = resource.qrCode || resource.id;
  const currentOrigin = window.location.origin.replace(/\/+$/, "");

  // Prefer the currently used host if this page is already opened on a LAN/domain URL.
  // This avoids stale hardcoded IPs in .env causing broken scanned links.
  const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const qrPath = `/qr/${encodeURIComponent(qrValue)}`;

  if (!isLocalHost) {
    return `${currentOrigin}${qrPath}`;
  }

  return qrValue;
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
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [qrImageError, setQrImageError] = useState("");

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

  const qrPayload = resource ? buildResourceQrPayload(resource) : "";

  useEffect(() => {
    let active = true;

    if (!qrPayload) {
      setQrImageUrl("");
      setQrImageError("");
      return () => {
        active = false;
      };
    }

    setQrImageError("");
    QRCode.toDataURL(qrPayload, {
      width: 280,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#111827",
        light: "#FFFFFF",
      },
    })
      .then((dataUrl) => {
        if (active) {
          setQrImageUrl(dataUrl);
        }
      })
      .catch(() => {
        if (active) {
          setQrImageUrl("");
          setQrImageError("Failed to render QR code");
        }
      });

    return () => {
      active = false;
    };
  }, [qrPayload]);
  const handleDelete = async () => {
    if (!window.confirm("Delete this resource?")) return;
    await apiDelete(`/resources/${id}`);
    navigate("/resources");
  };

  if (loading) {
    return (
      <ResourceAdminLayout>
        <div style={{ padding: 24, color: C.muted }}>Loading resource...</div>
      </ResourceAdminLayout>
    );
  }

  if (error || !resource) {
    return (
      <ResourceAdminLayout>
        <div style={{ padding: 24, color: C.red }}>{error || "Resource not found"}</div>
      </ResourceAdminLayout>
    );
  }

  const rows = [
    ["Type", resource.type || resource.resourceTypeName],
    ["Description", resource.description || "—"],
    ["How To Use", resource.usageInstructions || "—"],
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

  const isEquipment = normalizeTypeKey(resource.type || resource.resourceTypeName) === "EQUIPMENT";

  return (
    <ResourceAdminLayout>
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

          {qrPayload && (
            <div style={{ marginTop: 16, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, background: "#FAFBFC", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              {qrImageUrl ? (
                <img
                  src={qrImageUrl}
                  alt="Resource QR"
                  width={140}
                  height={140}
                  style={{ borderRadius: 10, border: `1px solid ${C.border}`, background: "#fff" }}
                />
              ) : (
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    background: "#fff",
                    display: "grid",
                    placeItems: "center",
                    color: C.muted,
                    fontSize: 12,
                    fontWeight: 600,
                    textAlign: "center",
                    padding: 10,
                  }}
                >
                  {qrImageError || "Rendering QR..."}
                </div>
              )}
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: C.muted, fontWeight: 700, marginBottom: 6 }}>
                  {isEquipment ? "Equipment QR Details" : "Scannable QR Code"}
                </div>
                <div style={{ color: C.text, fontWeight: 700, maxWidth: 580, wordBreak: "break-all", fontSize: 13 }}>
                  {qrPayload}
                </div>
                <div style={{ marginTop: 8, color: C.muted, fontSize: 13 }}>
                  📱 On LAN/domain access, this QR stores a public URL using the current host.
                  On localhost, it stores the raw code value for reliable in-app scanning and manual lookup.
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
    </ResourceAdminLayout>
  );
}
