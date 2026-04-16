import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../lib/api";
import ResourceAdminLayout from "./ResourceAdminLayout";

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

// Simple QR decoder for text-encoded QR codes
function parseQrText(text) {
  const lines = text.split("\n");
  const data = {};
  lines.forEach((line) => {
    const [key, ...valueParts] = line.split(": ");
    if (key && valueParts.length > 0) {
      data[key.trim()] = valueParts.join(": ").trim();
    }
  });
  return data;
}

export default function QRScannerPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [qrInput, setQrInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState(null);
  const [error, setError] = useState("");

  // Handle manual QR text input or parsed QR data
  const handleQrData = async (data) => {
    setError("");
    setResource(null);
    setScannedData(null);

    // Try to parse as equipment QR format
    const parsed = parseQrText(data);
    if (parsed.Resource) {
      setScannedData(parsed);
      return;
    }

    // Try to look up by QR code value in backend
    setLoading(true);
    try {
      const res = await apiGet(`/resources/lookup?qrCode=${encodeURIComponent(data)}`);
      if (res) {
        setResource(res);
      } else {
        setError("No resource found for this QR code");
      }
    } catch (err) {
      setError(err.message || "Failed to look up QR code");
    }
    setLoading(false);
  };

  const handleManualInput = () => {
    if (!qrInput.trim()) {
      setError("Enter QR code value");
      return;
    }
    handleQrData(qrInput.trim());
    setQrInput("");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        // For now, show a message that manual input is required
        setError("File upload QR decoding requires a QR library. Use manual input or phone camera instead.");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (err) {
      setError("Camera access denied. Use manual input instead.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setScanning(false);
  };

  // Simple frame capture (without external QR library, this is a fallback)
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      // Note: Full QR decoding requires jsQR or similar library
      setError("For best results, manually enter the QR code value or use a QR scanner app first.");
    }
  };

  return (
    <ResourceAdminLayout>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
        <button
          onClick={() => navigate("/resources")}
          style={{
            border: "none",
            background: "transparent",
            color: C.blue,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          ← Back to resources
        </button>

        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 50px rgba(15,23,42,.05)",
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>QR Code Scanner</div>
          <div style={{ color: C.muted, marginBottom: 20, fontSize: 14 }}>
            Scan or enter equipment/resource QR codes to view details
          </div>

          {/* Manual Input Section */}
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: C.muted,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Manual QR Input
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleManualInput()}
                placeholder="Paste or type QR code value..."
                style={{
                  flex: 1,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 14,
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={handleManualInput}
                style={{
                  border: "none",
                  background: C.blue,
                  color: "#fff",
                  borderRadius: 10,
                  padding: "10px 16px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Camera Section */}
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: C.muted,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Camera Scanner
            </div>
            {scanning ? (
              <div>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: `2px solid ${C.blue}`,
                    marginBottom: 12,
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{ display: "none" }}
                  width={300}
                  height={300}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={captureFrame}
                    style={{
                      flex: 1,
                      border: `1px solid ${C.border}`,
                      background: C.surface,
                      color: C.text,
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Capture
                  </button>
                  <button
                    onClick={stopCamera}
                    style={{
                      flex: 1,
                      border: "none",
                      background: C.red,
                      color: "#fff",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Stop
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={startCamera}
                style={{
                  width: "100%",
                  border: `2px dashed ${C.border}`,
                  background: "transparent",
                  color: C.blue,
                  borderRadius: 10,
                  padding: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                📷 Start Camera
              </button>
            )}
            <div style={{ marginTop: 8, color: C.muted, fontSize: 12 }}>
              Note: For best results, use your phone's native camera QR scanner first, then paste the result above.
            </div>
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: C.muted,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Upload QR Image
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                border: `2px dashed ${C.border}`,
                background: "transparent",
                color: C.text,
                borderRadius: 10,
                padding: "14px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              📁 Choose QR Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: `1px solid #FECACA`,
                borderRadius: 10,
                padding: 12,
                color: C.red,
                marginBottom: 20,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          {/* Scanned Data Display */}
          {scannedData && (
            <div
              style={{
                background: "#F0FDF4",
                border: `1px solid #BBEF63`,
                borderRadius: 14,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", color: C.green, fontWeight: 700, marginBottom: 12 }}>
                ✓ Equipment Details Found
              </div>
              <div style={{ color: C.text, fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {Object.entries(scannedData)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("\n")}
              </div>
            </div>
          )}

          {/* Resource Lookup Result */}
          {resource && (
            <div
              style={{
                background: "#F0FDF4",
                border: `1px solid #BBEF63`,
                borderRadius: 14,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".08em", color: C.green, fontWeight: 700, marginBottom: 12 }}>
                ✓ Resource Found
              </div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                {resource.name}
              </div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 12 }}>
                {resource.type || resource.resourceTypeName}
              </div>
              <button
                onClick={() => navigate(`/resources/${resource.id}`)}
                style={{
                  width: "100%",
                  border: "none",
                  background: C.green,
                  color: "#fff",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginBottom: 8,
                }}
              >
                View Full Details
              </button>
              <button
                onClick={() => {
                  setResource(null);
                  setQrInput("");
                }}
                style={{
                  width: "100%",
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  color: C.text,
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Scan Another
              </button>
            </div>
          )}

          {loading && (
            <div style={{ color: C.muted, textAlign: "center", padding: 20 }}>
              Looking up QR code...
            </div>
          )}
        </div>
      </div>
    </ResourceAdminLayout>
  );
}
