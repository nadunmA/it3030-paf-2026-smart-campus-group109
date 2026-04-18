import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";
import qrScannerWorkerPath from "qr-scanner/qr-scanner-worker.min?url";
import { apiGet } from "../../lib/api";
import ResourceAdminLayout from "./ResourceAdminLayout";
import { extractQrLookupValue } from "./qrUtils";

QrScanner.WORKER_PATH = qrScannerWorkerPath;

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
  const fileInputRef = useRef(null);
  const qrScannerRef = useRef(null);
  const processingRef = useRef(false);
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

    const lookupValue = extractQrLookupValue(data);
    if (!lookupValue) {
      setError("Invalid QR value. Paste the code or QR URL.");
      return;
    }

    // Try to parse as equipment QR format
    const parsed = parseQrText(lookupValue);
    if (parsed.Resource) {
      setScannedData(parsed);
      return;
    }

    // Try to look up by QR code value in backend
    setLoading(true);
    try {
      const res = await apiGet(`/resources/lookup?qrCode=${encodeURIComponent(lookupValue)}`);
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

    setError("");
    setScannedData(null);
    setResource(null);

    try {
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
      const decodedText = typeof result === "string" ? result : result?.data;
      if (!decodedText) {
        setError("No QR code detected in this image.");
        return;
      }

      await handleQrData(decodedText);
    } catch {
      setError("Failed to decode QR image. Try a clearer image or manual input.");
    }
  };

  const startCamera = async () => {
    setError("");
    try {
      if (!videoRef.current) return;

      if (!qrScannerRef.current) {
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          async (scanResult) => {
            const decodedText = typeof scanResult === "string" ? scanResult : scanResult?.data;
            if (!decodedText || processingRef.current) return;

            processingRef.current = true;
            try {
              stopCamera();
              await handleQrData(decodedText);
            } finally {
              processingRef.current = false;
            }
          },
          {
            preferredCamera: "environment",
            maxScansPerSecond: 8,
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
          },
        );
      }

      await qrScannerRef.current.start();
      setScanning(true);
    } catch (err) {
      setError("Unable to start camera scanner. Check camera permission or use manual input.");
    }
  };

  const stopCamera = () => {
    qrScannerRef.current?.stop();
    setScanning(false);
  };

  useEffect(
    () => () => {
      qrScannerRef.current?.destroy();
      qrScannerRef.current = null;
    },
    [],
  );

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
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={stopCamera}
                    style={{
                      width: "100%",
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
