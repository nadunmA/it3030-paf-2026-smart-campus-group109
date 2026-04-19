import React, { useEffect, useMemo, useState } from "react";
import Btn from "../../../components/ui/Btn";
import { apiGet } from "../../../lib/api";

const initialForm = {
  resourceId: "",
  resourceType: "LECTURE_HALL",
  bookingDate: "",
  startTime: "",
  endTime: "",
  purpose: "",
  expectedAttendees: 1,
};

export default function BookingForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const normalizeType = (value) =>
    String(value || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_");

  const filteredResources = useMemo(
    () =>
      resources.filter(
        (resource) =>
          normalizeType(resource.type || resource.resourceTypeName) ===
          normalizeType(form.resourceType),
      ),
    [resources, form.resourceType],
  );

  useEffect(() => {
    let active = true;

    const loadResources = async () => {
      setResourcesLoading(true);
      setError("");
      try {
        const data = await apiGet("/resources");
        const list = Array.isArray(data) ? data : data?.content || [];
        if (!active) return;
        setResources(list);
      } catch {
        if (!active) return;
        setResources([]);
        setError("Failed to load available resources. Please refresh.");
      } finally {
        if (active) setResourcesLoading(false);
      }
    };

    loadResources();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setForm((prev) => {
      const hasSelected = filteredResources.some((item) => item.id === prev.resourceId);
      return hasSelected ? prev : { ...prev, resourceId: "" };
    });
  }, [filteredResources]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.resourceId || !form.bookingDate || !form.startTime || !form.endTime || !form.purpose) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setError("Start time must be before end time.");
      return;
    }

    try {
      await onSubmit?.({
        ...form,
        expectedAttendees: Number(form.expectedAttendees),
      });
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Failed to create booking.");
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 12, maxWidth: 760 }}>
      <div style={gridStyle}>
        <Select
          label="Resource Type"
          value={form.resourceType}
          onChange={(v) =>
            setForm((prev) => ({
              ...prev,
              resourceType: v,
              resourceId: "",
            }))
          }
          options={["LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"]}
        />
        <label style={{ display: "grid", gap: 6 }}>
          <span style={labelStyle}>Resource *</span>
          <select
            value={form.resourceId}
            onChange={(e) => setField("resourceId", e.target.value)}
            style={inputStyle}
            disabled={resourcesLoading || filteredResources.length === 0}
          >
            <option value="">
              {resourcesLoading
                ? "Loading resources..."
                : filteredResources.length === 0
                  ? "No resources available"
                  : "Select a resource"}
            </option>
            {filteredResources.map((resource) => (
              <option key={resource.id} value={resource.id} style={{ color: "#000" }}>
                {resource.type || resource.resourceTypeName} - {resource.name} ({resource.location || "N/A"})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={gridStyle}>
        <Input
          label="Booking Date"
          type="date"
          required
          min={todayDate}
          value={form.bookingDate}
          onChange={(v) => setField("bookingDate", v)}
        />
        <Input label="Expected Attendees" type="number" min={1} required value={form.expectedAttendees} onChange={(v) => setField("expectedAttendees", v)} />
      </div>

      <div style={gridStyle}>
        <Input
          label="Start Time"
          type="time"
          required
          step={900}
          value={form.startTime}
          onChange={(v) => setField("startTime", v)}
        />
        <Input
          label="End Time"
          type="time"
          required
          step={900}
          min={form.startTime || undefined}
          value={form.endTime}
          onChange={(v) => setField("endTime", v)}
        />
      </div>

      <label style={{ display: "grid", gap: 6 }}>
        <span style={labelStyle}>Purpose *</span>
        <textarea
          value={form.purpose}
          onChange={(e) => setField("purpose", e.target.value)}
          placeholder="Describe booking purpose"
          rows={4}
          style={inputStyle}
        />
      </label>

      {error && <div style={{ color: "#FF6D8E", fontSize: ".82rem" }}>{error}</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <Btn type="submit" size="md">{submitting ? "Submitting..." : "Create Booking"}</Btn>
      </div>
    </form>
  );
}

function Input({ label, onChange, ...props }) {
  const shouldTriggerPicker = props.type === "date" || props.type === "time";
  const openNativePicker = (event) => {
    if (!shouldTriggerPicker) return;
    const input = event.currentTarget;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    }
  };

  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={labelStyle}>{label}</span>
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        onFocus={openNativePicker}
        onClick={openNativePicker}
        style={inputStyle}
      />
    </label>
  );
}

function Select({ label, options, onChange, ...props }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={labelStyle}>{label}</span>
      <select
        {...props}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      >
        {options.map((option) => (
          <option key={option} value={option} style={{ color: "#000" }}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const labelStyle = {
  color: "rgba(255,255,255,.76)",
  fontSize: ".8rem",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.16)",
  background: "rgba(255,255,255,.06)",
  color: "#fff",
  fontSize: ".85rem",
  fontFamily: "inherit",
};
