import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../lib/api";

const C = {
  bg: "#F5F7FA",
  surface: "#fff",
  border: "#E8EBF0",
  text: "#1A1D23",
  muted: "#6B7280",
  blue: "#2563EB",
  red: "#DC2626",
  green: "#16A34A",
};

export default function PublicQRDetailPage() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    // Try to fetch by ID first from the public API.
    apiGet(`/public/resources/${id}`)
      .then((data) => {
        if (active) setResource(data);
      })
      .catch((err) => {
        // If ID lookup fails, try QR code lookup from the public API.
        return apiGet(`/public/resources/lookup?qrCode=${encodeURIComponent(id)}`).then((data) => {
          if (active) setResource(data);
        });
      })
      .catch((err) => {
        if (active) setError(err.message || "Resource not found");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          background: C.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div style={{ textAlign: "center", color: C.muted }}>Loading resource...</div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div
        style={{
          background: C.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <div style={{ textAlign: "center", color: C.red, maxWidth: 400 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Resource Not Found</div>
          <div style={{ fontSize: 14, color: C.muted }}>
            {error || "The scanned QR code could not be found in the system."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "16px 0" }}>
      {/* Header */}
      <div
        style={{
          background: C.blue,
          color: "#fff",
          padding: "20px 16px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,.1)",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Smart Campus</div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>Resource Details</div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "16px", maxWidth: 600, margin: "0 auto" }}>
        {/* Card */}
        <div
          style={{
            background: C.surface,
            borderRadius: 16,
            padding: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
            marginBottom: 16,
          }}
        >
          {/* Resource Name */}
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 6, wordBreak: "break-word" }}>
              {resource.name}
            </div>
            <div style={{ fontSize: 14, color: C.muted, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600 }}>
              {resource.type || resource.resourceTypeName}
            </div>
          </div>

          {/* Key Details - Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {/* Location */}
            {resource.location && (
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 4, letterSpacing: ".05em" }}>
                  Location
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>
                  {resource.location}
                </div>
              </div>
            )}

            {/* Status */}
            {resource.status && (
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 4, letterSpacing: ".05em" }}>
                  Status
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>
                  {resource.status}
                </div>
              </div>
            )}

            {/* Capacity */}
            {resource.capacity && (
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 4, letterSpacing: ".05em" }}>
                  Capacity
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>
                  {resource.capacity}
                </div>
              </div>
            )}

            {/* Condition (for equipment) */}
            {resource.condition && (
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 4, letterSpacing: ".05em" }}>
                  Condition
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>
                  {resource.condition}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {resource.description && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 8, letterSpacing: ".05em" }}>
                Description
              </div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>
                {resource.description}
              </div>
            </div>
          )}

          {/* Usage Instructions (for equipment) */}
          {resource.usageInstructions && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", fontWeight: 700, marginBottom: 8, letterSpacing: ".05em" }}>
                How to Use
              </div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {resource.usageInstructions}
              </div>
            </div>
          )}

          {/* Equipment Details */}
          {(resource.serialNumber || resource.warrantyExpiry || resource.maintenanceDate) && (
            <div style={{ background: "#FEF5F5", borderRadius: 12, padding: 14, marginBottom: 16, borderLeft: `4px solid ${C.red}` }}>
              <div style={{ fontSize: 11, color: C.red, textTransform: "uppercase", fontWeight: 700, marginBottom: 10, letterSpacing: ".05em" }}>
                Equipment Details
              </div>
              {resource.serialNumber && (
                <div style={{ fontSize: 13, color: C.text, marginBottom: 8 }}>
                  <strong>Serial:</strong> {resource.serialNumber}
                </div>
              )}
              {resource.warrantyExpiry && (
                <div style={{ fontSize: 13, color: C.text, marginBottom: 8 }}>
                  <strong>Warranty Expiry:</strong> {resource.warrantyExpiry}
                </div>
              )}
              {resource.maintenanceDate && (
                <div style={{ fontSize: 13, color: C.text }}>
                  <strong>Maintenance Date:</strong> {resource.maintenanceDate}
                </div>
              )}
            </div>
          )}

          {/* Availability */}
          {(resource.availabilityStart || resource.availabilityEnd) && (
            <div style={{ background: "#F0FDF4", borderRadius: 12, padding: 14, marginBottom: 16, borderLeft: `4px solid ${C.green}` }}>
              <div style={{ fontSize: 11, color: C.green, textTransform: "uppercase", fontWeight: 700, marginBottom: 10, letterSpacing: ".05em" }}>
                Availability
              </div>
              {resource.availabilityStart && (
                <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>
                  <strong>From:</strong> {resource.availabilityStart}
                </div>
              )}
              {resource.availabilityEnd && (
                <div style={{ fontSize: 13, color: C.text }}>
                  <strong>To:</strong> {resource.availabilityEnd}
                </div>
              )}
            </div>
          )}

          {/* Technician Info */}
          {resource.assignedTechnicianName && (
            <div style={{ background: "#EFF6FF", borderRadius: 12, padding: 14, borderLeft: `4px solid ${C.blue}` }}>
              <div style={{ fontSize: 11, color: C.blue, textTransform: "uppercase", fontWeight: 700, marginBottom: 8, letterSpacing: ".05em" }}>
                Assigned Technician
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                {resource.assignedTechnicianName}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", color: C.muted, fontSize: 12 }}>
          <div>Resource ID: {resource.id}</div>
          <div style={{ marginTop: 4, fontSize: 11 }}>Last updated: {resource.updatedAt}</div>
        </div>
      </div>
    </div>
  );
}
