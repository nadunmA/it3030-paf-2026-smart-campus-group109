import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut } from "../../lib/api";

const C = {
  bg: "#F5F7FA",
  surface: "#fff",
  border: "#E8EBF0",
  text: "#1A1D23",
  muted: "#6B7280",
  blue: "#2563EB",
  blueBg: "#EFF6FF",
  blueBd: "#BFDBFE",
  red: "#B91C1C",
  redBg: "#FEF2F2",
  redBd: "#FECACA",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(15,23,42,.38)",
  backdropFilter: "blur(4px)",
};

const modalStyle = {
  width: "min(920px, 92vw)",
  maxHeight: "86vh",
  overflow: "auto",
  borderRadius: 20,
  background: C.surface,
  boxShadow: "0 20px 50px rgba(15,23,42,.12)",
  border: `1px solid ${C.border}`,
  padding: 24,
};

const fieldStyle = {
  width: "100%",
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  padding: "11px 12px",
  fontFamily: "inherit",
  fontSize: 14,
  color: C.text,
  background: C.surface,
};

function pick(value) {
  return value == null ? "" : value;
}

export default function ResourceFormModal({ isOpen, resource, onClose, onSaved }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    resourceTypeId: "",
    type: "",
    description: "",
    location: "",
    capacity: "",
    cost: "",
    warrantyExpiry: "",
    assignedTechnicianId: "",
    serialNumber: "",
    condition: "EXCELLENT",
    maintenanceDate: "",
    availabilityStart: "",
    availabilityEnd: "",
    availability: "AVAILABLE",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setError("");
    setLoading(true);

    Promise.all([apiGet("/resources/types")])
      .then(([typeData]) => {
        if (!active) return;
        const normalizedTypes = Array.isArray(typeData) ? typeData : typeData?.content || [];
        setTypes(normalizedTypes);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Failed to load form data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const initialTypeId = pick(resource?.resourceTypeId || "");
    const initialTypeName = pick(resource?.type || resource?.resourceTypeName || "");
    const selectedType = types.find((item) => item.id === initialTypeId || item.name === initialTypeName);
    const fallbackTypeId = !resource?.id && !initialTypeId && types.length > 0 ? types[0].id : initialTypeId;
    const fallbackTypeName = !resource?.id && !initialTypeName && types.length > 0 ? types[0].name : initialTypeName;

    setForm({
      name: pick(resource?.name),
      resourceTypeId: selectedType?.id || fallbackTypeId,
      type: selectedType?.name || fallbackTypeName,
      description: pick(resource?.description),
      location: pick(resource?.location),
      capacity: pick(resource?.capacity),
      cost: pick(resource?.cost),
      warrantyExpiry: pick(resource?.warrantyExpiry),
      assignedTechnicianId: pick(resource?.assignedTechnicianId),
      serialNumber: pick(resource?.serialNumber),
      condition: pick(resource?.condition || "EXCELLENT"),
      maintenanceDate: pick(resource?.maintenanceDate),
      availabilityStart: pick(resource?.availabilityStart),
      availabilityEnd: pick(resource?.availabilityEnd),
      availability: pick(resource?.availability || "AVAILABLE"),
      status: pick(resource?.status || "ACTIVE"),
    });
  }, [isOpen, resource, types]);

  const selectedTypeLabel = useMemo(() => {
    const selected = types.find((item) => item.id === form.resourceTypeId || item.name === form.type);
    return selected?.name || form.type || "";
  }, [form.resourceTypeId, form.type, types]);

  if (!isOpen) return null;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (!form.name.trim()) {
      setSaving(false);
      setError("Name is required");
      return;
    }

    if (!form.resourceTypeId) {
      setSaving(false);
      setError("Type is required");
      return;
    }

    if (!form.location.trim()) {
      setSaving(false);
      setError("Location is required");
      return;
    }

    if (form.capacity === "" || Number(form.capacity) <= 0) {
      setSaving(false);
      setError("Capacity must be greater than 0");
      return;
    }

    const isCreate = !resource?.id;
    const parsedCost =
      form.cost === ""
        ? isCreate
          ? 0
          : null
        : Number(form.cost);

    const payload = {
      name: form.name.trim(),
      resourceTypeId: form.resourceTypeId || undefined,
      type: selectedTypeLabel || undefined,
      description: form.description.trim() || undefined,
      location: form.location.trim(),
      capacity: form.capacity === "" ? null : Number(form.capacity),
      cost: parsedCost,
      warrantyExpiry: form.warrantyExpiry || null,
      assignedTechnicianId: form.assignedTechnicianId || null,
      serialNumber: form.serialNumber || null,
      condition: form.condition || null,
      maintenanceDate: form.maintenanceDate || null,
      availabilityStart: form.availabilityStart || null,
      availabilityEnd: form.availabilityEnd || null,
      status: form.status || null,
    };

    try {
      if (resource?.id) {
        await apiPut(`/resources/${resource.id}`, payload);
      } else {
        await apiPost("/resources", payload);
      }
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(err.message || "Failed to save resource");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(event) => event.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.04em", color: C.text }}>
              {resource?.id ? "Edit Resource" : "Create Resource"}
            </div>
            <div style={{ color: C.muted, marginTop: 4, fontSize: 14 }}>
              Manage lecture halls, labs, meeting rooms, and equipment.
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 20, color: "#94A3B8" }}>
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ padding: "24px 0", color: C.muted }}>Loading form data...</div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: "grid", gap: 14 }}>
            {error && (
              <div style={{ color: C.red, background: C.redBg, border: `1px solid ${C.redBd}`, borderRadius: 12, padding: "10px 12px", fontSize: 13 }}>
                {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Name</div>
                <input style={fieldStyle} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Lecture Hall 101" />
              </label>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Type</div>
                <select style={fieldStyle} value={form.resourceTypeId} onChange={(event) => update("resourceTypeId", event.target.value)}>
                  <option value="">Select type</option>
                  {types.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Description</div>
              <textarea style={{ ...fieldStyle, minHeight: 92, resize: "vertical" }} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Short description of the resource" />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Location</div>
                <input style={fieldStyle} value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="Building A, Floor 2" />
              </label>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Capacity</div>
                <input style={fieldStyle} type="number" min="1" value={form.capacity} onChange={(event) => update("capacity", event.target.value)} placeholder="120" />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Availability Start</div>
                <input style={fieldStyle} type="datetime-local" value={form.availabilityStart} onChange={(event) => update("availabilityStart", event.target.value)} />
              </label>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Availability End</div>
                <input style={fieldStyle} type="datetime-local" value={form.availabilityEnd} onChange={(event) => update("availabilityEnd", event.target.value)} />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Status</div>
                <select style={fieldStyle} value={form.status} onChange={(event) => update("status", event.target.value)}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                </select>
              </label>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Availability</div>
                <select style={fieldStyle} value={form.availability} onChange={(event) => update("availability", event.target.value)}>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="UNAVAILABLE">UNAVAILABLE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </label>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Condition</div>
                <select style={fieldStyle} value={form.condition} onChange={(event) => update("condition", event.target.value)}>
                  <option value="EXCELLENT">EXCELLENT</option>
                  <option value="GOOD">GOOD</option>
                  <option value="FAIR">FAIR</option>
                  <option value="POOR">POOR</option>
                </select>
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Cost</div>
                <input style={fieldStyle} type="number" min="0" step="0.01" value={form.cost} onChange={(event) => update("cost", event.target.value)} placeholder="15000" />
              </label>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Warranty Expiry</div>
                <input style={fieldStyle} type="date" value={form.warrantyExpiry} onChange={(event) => update("warrantyExpiry", event.target.value)} />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Assigned Technician ID (optional)</div>
                <input style={fieldStyle} value={form.assignedTechnicianId} onChange={(event) => update("assignedTechnicianId", event.target.value)} placeholder="Paste existing technician id" />
              </label>
              <label>
                <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Serial Number</div>
                <input style={fieldStyle} value={form.serialNumber} onChange={(event) => update("serialNumber", event.target.value)} placeholder="SN-123" />
              </label>
            </div>

            <label>
              <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: C.muted }}>Maintenance Date</div>
              <input style={fieldStyle} type="date" value={form.maintenanceDate} onChange={(event) => update("maintenanceDate", event.target.value)} />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
              <button type="button" onClick={onClose} style={{ border: `1px solid ${C.border}`, background: C.surface, color: C.text, borderRadius: 12, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} style={{ border: "none", background: C.blue, color: "#fff", borderRadius: 12, padding: "10px 18px", fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>
                {saving ? "Saving..." : resource?.id ? "Update Resource" : "Create Resource"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
