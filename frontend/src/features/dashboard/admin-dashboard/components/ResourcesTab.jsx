import { useState } from "react";
import { apiDownload } from "../../../../lib/api";
import { Badge, C, FilterPills, Table } from "./AdminUi";

export default function ResourcesTab({
  navigate,
  resourceFilter,
  setResourceFilter,
  filteredResources,
  btnPrimary,
}) {
  const [reportDate, setReportDate] = useState("");
  const [reportFromDate, setReportFromDate] = useState("");
  const [reportToDate, setReportToDate] = useState("");
  const [reportBusy, setReportBusy] = useState(false);
  const [reportError, setReportError] = useState("");

  const pgTitle = {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-.04em",
    color: C.text,
    marginBottom: 6,
  };
  const pgSub = { fontSize: 13, color: C.muted, marginBottom: 24 };

  const handleDownloadReport = async () => {
    const singleDate = reportDate.trim();
    const fromDate = reportFromDate.trim();
    const toDate = reportToDate.trim();

    if (!singleDate && !fromDate && !toDate) {
      setReportError("Choose a date or date range for the report.");
      return;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      setReportError("Select both start and end dates for a date range.");
      return;
    }

    setReportBusy(true);
    setReportError("");

    try {
      const params = new URLSearchParams();
      if (singleDate) {
        params.set("reportDate", singleDate);
      } else {
        params.set("fromDate", fromDate);
        params.set("toDate", toDate);
      }

      const { blob, fileName } = await apiDownload(
        `/resources/export/csv?${params.toString()}`,
      );
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setReportError(err.message || "Failed to download report");
    } finally {
      setReportBusy(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <div style={pgTitle}>Resource Catalogue</div>
        <button
          type="button"
          onClick={() => navigate("/resources")}
          style={btnPrimary}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = C.blue)}
        >
          + Add Resource
        </button>
      </div>
      <div style={pgSub}>Manage facilities, labs, rooms and equipment</div>

      <FilterPills
        options={["All", "Room", "Lab", "Equipment", "Hall"]}
        active={resourceFilter}
        onChange={setResourceFilter}
      />

      <div
        style={{
          marginBottom: 16,
          padding: 16,
          borderRadius: 16,
          border: `1px solid ${C.border}`,
          background: "#FAFBFC",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>
          Resource Report
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr)) auto",
            gap: 10,
            alignItems: "end",
          }}
        >
          <label>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: C.hint,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Date
            </div>
            <input
              type="date"
              value={reportDate}
              onChange={(event) => {
                setReportDate(event.target.value);
                if (event.target.value) {
                  setReportFromDate("");
                  setReportToDate("");
                }
              }}
              style={{
                width: "100%",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "10px 12px",
                fontFamily: "inherit",
              }}
            />
          </label>

          <label>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: C.hint,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Start Date
            </div>
            <input
              type="date"
              value={reportFromDate}
              onChange={(event) => {
                setReportFromDate(event.target.value);
                if (event.target.value) setReportDate("");
              }}
              style={{
                width: "100%",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "10px 12px",
                fontFamily: "inherit",
              }}
            />
          </label>

          <label>
            <div
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: C.hint,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              End Date
            </div>
            <input
              type="date"
              value={reportToDate}
              onChange={(event) => {
                setReportToDate(event.target.value);
                if (event.target.value) setReportDate("");
              }}
              style={{
                width: "100%",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: "10px 12px",
                fontFamily: "inherit",
              }}
            />
          </label>

          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={reportBusy}
            style={{
              ...btnPrimary,
              opacity: reportBusy ? 0.8 : 1,
              minWidth: 160,
            }}
          >
            {reportBusy ? "Downloading..." : "Download Report"}
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: C.muted }}>
          Choose one date for a single-day report or select both start and end dates for a range.
        </div>
        {reportError && (
          <div style={{ marginTop: 8, color: "#B91C1C", fontSize: 12 }}>
            {reportError}
          </div>
        )}
      </div>

      <Table
        cols={["Name", "Type", "Location", "Capacity", "Status", "Action"]}
        rows={filteredResources.map((r) => [
          <span
            onClick={() => navigate(`/resources/${r.id}`)}
            style={{ fontWeight: 700, color: C.blue, cursor: "pointer" }}
            title="Open resource details"
          >
            {r.name}
          </span>,
          r.type,
          r.location,
          r.capacity,
          <Badge type={r.status || "ACTIVE"}>
            {(r.status || "ACTIVE").replace("_", " ")}
          </Badge>,
          <span
            onClick={() => navigate(`/resources/${r.id}`)}
            style={{
              fontSize: 12,
              color: C.blue,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            View Details
          </span>,
        ])}
      />
    </div>
  );
}
