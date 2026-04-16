import { useState, useEffect } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../../../lib/api";

const C = {
  bg: "#F5F7FA",
  surface: "#fff",
  border: "#E8EBF0",
  text: "#1A1D23",
  muted: "#6B7280",
  hint: "#9CA3AF",
  blue: "#2563EB",
  blueBg: "#EFF6FF",
  blueBd: "#BFDBFE",
  green: "#059669",
  greenBg: "#ECFDF5",
  greenBd: "#A7F3D0",
  orange: "#D97706",
  orangeBg: "#FFFBEB",
  orangeBd: "#FDE68A",
  red: "#DC2626",
  redBg: "#FEF2F2",
  redBd: "#FECACA",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  purpleBd: "#DDD6FE",
};

// Badge component
function Badge({ type, children }) {
  const BADGE_STYLES = {
    AVAILABLE: { bg: C.greenBg, color: C.green, bd: C.greenBd },
    UNAVAILABLE: { bg: C.redBg, color: C.red, bd: C.redBd },
    MAINTENANCE: { bg: C.orangeBg, color: C.orange, bd: C.orangeBd },
    EXCELLENT: { bg: C.greenBg, color: C.green, bd: C.greenBd },
    GOOD: { bg: C.blueBg, color: C.blue, bd: C.blueBd },
    FAIR: { bg: C.orangeBg, color: C.orange, bd: C.orangeBd },
    POOR: { bg: C.redBg, color: C.red, bd: C.redBd },
  };
  const s = BADGE_STYLES[type] || {
    bg: "#F1F5F9",
    color: "#64748B",
    bd: "#E2E8F0",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.bd}`,
        borderRadius: 99,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.color,
        }}
      />
      {children}
    </span>
  );
}

// Table component
function Table({ cols, rows }) {
  const [hov, setHov] = useState(null);
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 13,
        overflow: "hidden",
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ background: "#FAFBFC" }}>
            {cols.map((c) => (
              <th
                key={c}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.hint,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  padding: "11px 16px",
                  borderBottom: `1px solid ${C.border}`,
                  textAlign: "left",
                }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: hov === i ? "#F8FAFC" : "transparent",
                transition: "background .1s",
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "11px 16px",
                    borderBottom:
                      i < rows.length - 1 ? `1px solid #F1F5F9` : "none",
                    color: C.text,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Panel component
function Panel({ title, action, onAction, children }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 13,
        padding: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
          {title}
        </span>
        {action && (
          <span
            onClick={onAction}
            style={{
              fontSize: 12,
              color: C.blue,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {action}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// Resource Detail Modal
function ResourceDetailModal({ resource, onClose, onEdit, onDelete }) {
  if (!resource) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: 14,
          width: "90%",
          maxWidth: 600,
          maxHeight: "80vh",
          overflow: "auto",
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: 16,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: C.text,
                margin: 0,
              }}
            >
              {resource.name}
            </h2>
            <p style={{ fontSize: 12, color: C.hint, margin: "4px 0 0 0" }}>
              {resource.resourceTypeName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 20,
              cursor: "pointer",
              color: C.hint,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <Badge type={resource.availability}>{resource.availability}</Badge>
          <Badge type={resource.condition} style={{ marginLeft: 8 }}>
            {resource.condition}
          </Badge>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {[
            { label: "Location", value: resource.location },
            { label: "Capacity", value: resource.capacity },
            { label: "Cost", value: `$${resource.cost?.toFixed(2) || "N/A"}` },
            { label: "Serial Number", value: resource.serialNumber || "—" },
            { label: "Warranty Expiry", value: resource.warrantyExpiry || "—" },
            {
              label: "Maintenance Date",
              value: resource.maintenanceDate || "—",
            },
            {
              label: "Assigned Technician",
              value: resource.assignedTechnicianName || "Unassigned",
            },
          ].map((item, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: 11,
                  color: C.hint,
                  fontWeight: 600,
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {resource.qrCode && (
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <div
              style={{
                fontSize: 11,
                color: C.hint,
                fontWeight: 600,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              QR Code
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.muted,
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {resource.qrCode}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 8,
            borderTop: `1px solid ${C.border}`,
            paddingTop: 16,
          }}
        >
          <button
            onClick={onEdit}
            style={{
              flex: 1,
              padding: "9px 16px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.surface,
              color: C.blue,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.blueBg;
              e.currentTarget.style.borderColor = C.blueBd;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.surface;
              e.currentTarget.style.borderColor = C.border;
            }}
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            style={{
              flex: 1,
              padding: "9px 16px",
              borderRadius: 8,
              border: `1px solid ${C.redBd}`,
              background: C.redBg,
              color: C.red,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FEE2E2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.redBg;
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Halls Tab Component
export default function HallsTab() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filters, setFilters] = useState({
    availability: "All",
    typeId: "All",
    location: "",
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet("/admin/facilities?page=0&size=100");
      setResources(Array.isArray(data) ? data : data?.content || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResource = async (formData) => {
    try {
      if (editingResource) {
        await apiPatch(`/admin/facilities/${editingResource.id}`, formData);
      } else {
        await apiPost("/admin/facilities", formData);
      }
      loadResources();
      setShowForm(false);
      setEditingResource(null);
    } catch (e) {
      console.error(e);
      setError("Failed to save resource");
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      await apiDelete(`/admin/facilities/${resourceId}`);
      loadResources();
      setSelectedResource(null);
    } catch (e) {
      console.error(e);
      setError("Failed to delete resource");
    }
  };

  const filteredResources = resources.filter((r) => {
    if (
      filters.availability !== "All" &&
      r.availability !== filters.availability
    )
      return false;
    if (filters.typeId !== "All" && r.resourceTypeId !== filters.typeId)
      return false;
    if (
      filters.location &&
      !r.location.toLowerCase().includes(filters.location.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        <p style={{ color: C.muted }}>Loading resources...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 6,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-.04em",
                color: C.text,
                marginBottom: 2,
              }}
            >
              Facilities & Assets
            </div>
            <div style={{ fontSize: 13, color: C.muted }}>
              Manage university resources, halls, labs, and equipment
            </div>
          </div>
          <button
            onClick={() => {
              setEditingResource(null);
              setShowForm(true);
            }}
            style={{
              padding: "9px 20px",
              borderRadius: 99,
              background: C.blue,
              color: "#fff",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}
          >
            + Add Resource
          </button>
        </div>
      </div>

      {error && (
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
          {error}
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <div>
          <label
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.hint,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            Type
          </label>
          <select
            value={filters.typeId}
            onChange={(e) => setFilters({ ...filters, typeId: e.target.value })}
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              background: C.surface,
              color: C.text,
              fontSize: 12,
              padding: "8px 12px",
              fontFamily: "inherit",
            }}
          >
            <option value="All">All</option>
            {[
              ...new Map(
                resources.map((r) => [r.resourceTypeId, r.resourceTypeName]),
              ).entries(),
            ].map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.hint,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            Availability
          </label>
          <select
            value={filters.availability}
            onChange={(e) =>
              setFilters({ ...filters, availability: e.target.value })
            }
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              background: C.surface,
              color: C.text,
              fontSize: 12,
              padding: "8px 12px",
              fontFamily: "inherit",
            }}
          >
            <option>All</option>
            <option>AVAILABLE</option>
            <option>UNAVAILABLE</option>
            <option>MAINTENANCE</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.hint,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            Search Location
          </label>
          <input
            type="text"
            placeholder="e.g., Building A, Room 101"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            style={{
              width: "100%",
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              background: C.surface,
              color: C.text,
              fontSize: 12,
              padding: "8px 12px",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* Resources Table */}
      {filteredResources.length === 0 ? (
        <Panel title="Resources">
          <div style={{ padding: "32px 16px", textAlign: "center" }}>
            <p style={{ color: C.hint, margin: 0 }}>
              No resources found. Create your first resource to get started.
            </p>
          </div>
        </Panel>
      ) : (
        <Table
          cols={[
            "Name",
            "Type",
            "Location",
            "Capacity",
            "Availability",
            "Condition",
            "Actions",
          ]}
          rows={filteredResources.map((r) => [
            <span style={{ fontWeight: 600 }}>{r.name}</span>,
            r.resourceTypeName,
            r.location,
            r.capacity,
            <Badge type={r.availability}>{r.availability}</Badge>,
            <Badge type={r.condition}>{r.condition}</Badge>,
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setEditingResource(r);
                  setShowForm(true);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.blue,
                  cursor: "pointer",
                  fontSize: 16,
                  padding: 0,
                }}
                title="Edit"
              >
                ✎
              </button>
              <button
                onClick={() => setSelectedResource(r)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.blue,
                  cursor: "pointer",
                  fontSize: 16,
                  padding: 0,
                }}
                title="View Details"
              >
                👁
              </button>
            </div>,
          ])}
        />
      )}

      {/* Resource Form Modal */}
      {showForm && (
        <ResourceFormModal
          resource={editingResource}
          onSave={handleSaveResource}
          onCancel={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
        />
      )}

      {/* Resource Detail Modal */}
      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onEdit={() => {
            setEditingResource(selectedResource);
            setSelectedResource(null);
            setShowForm(true);
          }}
          onDelete={() => {
            handleDeleteResource(selectedResource.id);
          }}
        />
      )}
    </div>
  );
}

// Resource Form Modal
function ResourceFormModal({ resource, onSave, onCancel }) {
  const [resourceTypes, setResourceTypes] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: resource?.name || "",
    resourceTypeId: resource?.resourceTypeId || "",
    location: resource?.location || "",
    capacity: resource?.capacity || "",
    cost: resource?.cost || "",
    warrantyExpiry: resource?.warrantyExpiry || "",
    assignedTechnicianId: resource?.assignedTechnicianId || "",
    serialNumber: resource?.serialNumber || "",
    condition: resource?.condition || "EXCELLENT",
    maintenanceDate: resource?.maintenanceDate || "",
  });

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const types = await apiGet("/resources/types");
      const users = await apiGet("/admin/users");
      setResourceTypes(Array.isArray(types) ? types : types?.data || []);
      const techs = Array.isArray(users) ? users : users?.data || [];
      setTechnicians(techs.filter((u) => u.role === "TECHNICIAN"));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div style={{ background: C.surface, borderRadius: 14, padding: 24 }}>
          <p style={{ color: C.muted, margin: 0 }}>Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: 14,
          width: "90%",
          maxWidth: 700,
          maxHeight: "80vh",
          overflow: "auto",
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: C.text,
            margin: "0 0 16px 0",
          }}
        >
          {resource ? "Edit Resource" : "Create New Resource"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <FormField
              label="Name"
              required
              value={formData.name}
              onChange={(v) => handleChange("name", v)}
              placeholder="e.g., Lecture Hall 101"
            />
            <FormField
              label="Type"
              required
              as="select"
              value={formData.resourceTypeId}
              onChange={(v) => handleChange("resourceTypeId", v)}
            >
              <option value="">Select a type</option>
              {resourceTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </FormField>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <FormField
              label="Location"
              required
              value={formData.location}
              onChange={(v) => handleChange("location", v)}
              placeholder="e.g., Building A, Room 101"
            />
            <FormField
              label="Capacity"
              type="number"
              required
              value={formData.capacity}
              onChange={(v) => handleChange("capacity", v)}
              placeholder="e.g., 50"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <FormField
              label="Cost ($)"
              type="number"
              step="0.01"
              required
              value={formData.cost}
              onChange={(v) => handleChange("cost", v)}
              placeholder="e.g., 5000"
            />
            <FormField
              label="Serial Number"
              value={formData.serialNumber}
              onChange={(v) => handleChange("serialNumber", v)}
              placeholder="e.g., SN-12345"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <FormField
              label="Warranty Expiry"
              type="date"
              value={formData.warrantyExpiry}
              onChange={(v) => handleChange("warrantyExpiry", v)}
            />
            <FormField
              label="Maintenance Date"
              type="date"
              value={formData.maintenanceDate}
              onChange={(v) => handleChange("maintenanceDate", v)}
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <FormField
              label="Condition"
              as="select"
              value={formData.condition}
              onChange={(v) => handleChange("condition", v)}
            >
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
            </FormField>
            <FormField
              label="Assigned Technician"
              as="select"
              value={formData.assignedTechnicianId}
              onChange={(v) => handleChange("assignedTechnicianId", v)}
            >
              <option value="">Unassigned</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </FormField>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              borderTop: `1px solid ${C.border}`,
              paddingTop: 16,
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "9px 16px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.surface,
                color: C.text,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "9px 16px",
                borderRadius: 8,
                border: "none",
                background: C.blue,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {resource ? "Update Resource" : "Create Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Form Field Helper
function FormField({
  label,
  required,
  as = "input",
  value,
  onChange,
  ...props
}) {
  return (
    <div>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: C.hint,
          textTransform: "uppercase",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label} {required && <span style={{ color: C.red }}>*</span>}
      </label>
      {as === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            border: `1px solid ${C.border}`,
            borderRadius: 7,
            background: C.surface,
            color: C.text,
            fontSize: 13,
            padding: "8px 12px",
            fontFamily: "inherit",
          }}
          {...props}
        />
      ) : (
        <input
          type={as === "input" ? props.type || "text" : as}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            border: `1px solid ${C.border}`,
            borderRadius: 7,
            background: C.surface,
            color: C.text,
            fontSize: 13,
            padding: "8px 12px",
            fontFamily: "inherit",
          }}
          {...props}
        />
      )}
    </div>
  );
}
