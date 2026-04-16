import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiDownload, apiGet } from "../../lib/api";
import ResourceFormModal from "./ResourceFormModal";
import StatusBadge from "./StatusBadge";

const C = {
  bg: "#F5F7FA",
  surface: "#fff",
  border: "#E8EBF0",
  text: "#1A1D23",
  muted: "#6B7280",
  hint: "#9CA3AF",
  blue: "#2563EB",
};

function readUser() {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function cardStyle() {
  return {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 16px 40px rgba(15,23,42,.04)",
  };
}

export default function ResourceListPage() {
  const navigate = useNavigate();
  const user = readUser();
  const isAdmin = user?.role === "ADMIN";

  const [resources, setResources] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [filters, setFilters] = useState({ type: "", location: "", capacity: "" });
  const [qrCode, setQrCode] = useState("");
  const [qrError, setQrError] = useState("");
  const [exportingCsv, setExportingCsv] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([apiGet("/resources/types"), apiGet(`/resources?type=${encodeURIComponent(filters.type)}&location=${encodeURIComponent(filters.location)}&capacity=${encodeURIComponent(filters.capacity)}`)])
      .then(([typeData, resourceData]) => {
        if (!active) return;
        setTypes(Array.isArray(typeData) ? typeData : typeData?.content || []);
        setResources(Array.isArray(resourceData) ? resourceData : resourceData?.content || resourceData || []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load resources");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters.type, filters.location, filters.capacity]);

  const typeOptions = useMemo(() => types, [types]);

  const handleQrLookup = async () => {
    if (!qrCode.trim()) {
      setQrError("Enter a QR code to lookup");
      return;
    }

    try {
      setQrError("");
      const resource = await apiGet(`/resources/lookup?qrCode=${encodeURIComponent(qrCode.trim())}`);
      if (resource?.id) {
        navigate(`/resources/${resource.id}`);
        return;
      }
      setQrError("Resource lookup failed");
    } catch {
      setQrError("No resource found for this QR code");
    }
  };

  const handleExportCsv = async () => {
    const params = new URLSearchParams({
      type: filters.type,
      location: filters.location,
      capacity: filters.capacity,
    });

    try {
      setExportingCsv(true);
      const { blob, fileName } = await apiDownload(`/resources/export/csv?${params.toString()}`);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError(err.message || "Export failed");
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportPdf = () => {
    const popup = window.open("", "_blank", "width=1100,height=780");
    if (!popup) {
      setError("Popup blocked. Allow popups to export PDF.");
      return;
    }

    const rowsHtml = resources
      .map(
        (resource, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${resource.name || ""}</td>
            <td>${resource.type || resource.resourceTypeName || ""}</td>
            <td>${resource.location || ""}</td>
            <td>${resource.capacity ?? ""}</td>
            <td>${resource.status || ""}</td>
          </tr>`,
      )
      .join("");

    popup.document.write(`
      <html>
      <head>
        <title>Resource Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
          h1 { margin: 0 0 4px; }
          p { margin: 0 0 16px; color: #475569; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 12px; text-align: left; }
          th { background: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>Resource Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
      </html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  if (loading) {
    return <div style={{ padding: 24, color: C.muted }}>Loading resources...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "start", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-.05em", color: C.text }}>Resource Catalogue</div>
            <div style={{ color: C.muted, marginTop: 6 }}>Search and browse lecture halls, labs, meeting rooms, and equipment.</div>
          </div>
          {isAdmin && (
            <button onClick={() => setEditing(true)} style={{ border: "none", background: C.blue, color: "#fff", borderRadius: 999, padding: "12px 18px", fontWeight: 800, cursor: "pointer" }}>
              + Add Resource
            </button>
          )}
        </div>

        <div style={{ ...cardStyle(), marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr auto", gap: 12, alignItems: "end" }}>
            <label>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: C.hint, fontWeight: 700, marginBottom: 6 }}>Type</div>
              <select value={filters.type} onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))} style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 12px", fontFamily: "inherit" }}>
                <option value="">All types</option>
                {typeOptions.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: C.hint, fontWeight: 700, marginBottom: 6 }}>Location</div>
              <input value={filters.location} onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))} placeholder="Building A" style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 12px", fontFamily: "inherit" }} />
            </label>
            <label>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: C.hint, fontWeight: 700, marginBottom: 6 }}>Capacity</div>
              <input type="number" min="0" value={filters.capacity} onChange={(event) => setFilters((prev) => ({ ...prev, capacity: event.target.value }))} placeholder="100" style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 12px", fontFamily: "inherit" }} />
            </label>
            <button onClick={() => setFilters({ type: "", location: "", capacity: "" })} style={{ border: `1px solid ${C.border}`, background: "#fff", color: C.text, borderRadius: 12, padding: "11px 14px", fontWeight: 700, cursor: "pointer" }}>
              Reset
            </button>
          </div>
        </div>

        <div style={{ ...cardStyle(), marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "2fr auto auto auto" : "2fr auto", gap: 10, alignItems: "end" }}>
            <label>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: C.hint, fontWeight: 700, marginBottom: 6 }}>QR Lookup</div>
              <input
                value={qrCode}
                onChange={(event) => setQrCode(event.target.value)}
                placeholder="RESOURCE_..."
                style={{ width: "100%", border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 12px", fontFamily: "inherit" }}
              />
            </label>
            <button onClick={handleQrLookup} style={{ border: `1px solid ${C.border}`, background: "#fff", color: C.text, borderRadius: 12, padding: "11px 14px", fontWeight: 700, cursor: "pointer" }}>
              Find Resource
            </button>
            {isAdmin && (
              <button onClick={handleExportCsv} disabled={exportingCsv} style={{ border: "none", background: C.blue, color: "#fff", borderRadius: 12, padding: "11px 14px", fontWeight: 700, cursor: "pointer", opacity: exportingCsv ? 0.8 : 1 }}>
                {exportingCsv ? "Exporting..." : "Export CSV"}
              </button>
            )}
            {isAdmin && (
              <button onClick={handleExportPdf} style={{ border: `1px solid ${C.border}`, background: "#fff", color: C.text, borderRadius: 12, padding: "11px 14px", fontWeight: 700, cursor: "pointer" }}>
                Export PDF
              </button>
            )}
          </div>
          {qrError && <div style={{ marginTop: 10, color: "#B91C1C", fontSize: 13 }}>{qrError}</div>}
        </div>

        {error && <div style={{ marginBottom: 16, color: "#B91C1C", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "12px 14px" }}>{error}</div>}

        <div style={cardStyle()}>
          {resources.length === 0 ? (
            <div style={{ padding: 34, textAlign: "center", color: C.muted }}>No resources found for the current filters.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {resources.map((resource) => (
                <button key={resource.id} onClick={() => navigate(`/resources/${resource.id}`)} style={{ textAlign: "left", border: `1px solid ${C.border}`, background: "#fff", borderRadius: 18, padding: 18, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "start" }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{resource.name}</div>
                      <div style={{ color: C.muted, marginTop: 4 }}>{resource.type || resource.resourceTypeName}</div>
                      <div style={{ color: C.hint, marginTop: 8, fontSize: 13 }}>{resource.location} · Capacity {resource.capacity}</div>
                    </div>
                    <StatusBadge status={resource.status} availability={resource.availability} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAdmin && editing && (
        <ResourceFormModal
          isOpen={editing}
          onClose={() => setEditing(false)}
          onSaved={async () => {
            const resourceData = await apiGet(`/resources?type=${encodeURIComponent(filters.type)}&location=${encodeURIComponent(filters.location)}&capacity=${encodeURIComponent(filters.capacity)}`);
            setResources(Array.isArray(resourceData) ? resourceData : resourceData?.content || resourceData || []);
          }}
        />
      )}
    </div>
  );
}
