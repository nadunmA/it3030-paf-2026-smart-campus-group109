import { useState } from "react";
import Btn from "../../../components/ui/Btn";

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

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

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
        <Input label="Resource ID" required value={form.resourceId} onChange={(v) => setField("resourceId", v)} />
        <Select
          label="Resource Type"
          value={form.resourceType}
          onChange={(v) => setField("resourceType", v)}
          options={["LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"]}
        />
      </div>

      <div style={gridStyle}>
        <Input label="Booking Date" type="date" required value={form.bookingDate} onChange={(v) => setField("bookingDate", v)} />
        <Input label="Expected Attendees" type="number" min={1} required value={form.expectedAttendees} onChange={(v) => setField("expectedAttendees", v)} />
      </div>

      <div style={gridStyle}>
        <Input label="Start Time" type="time" required value={form.startTime} onChange={(v) => setField("startTime", v)} />
        <Input label="End Time" type="time" required value={form.endTime} onChange={(v) => setField("endTime", v)} />
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
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={labelStyle}>{label}</span>
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
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
