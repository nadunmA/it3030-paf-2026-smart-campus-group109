export function extractQrLookupValue(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";

  const fromUrl = extractFromQrUrl(raw);
  if (fromUrl) return fromUrl;

  return raw;
}

function extractFromQrUrl(value) {
  try {
    const parsed = value.startsWith("http://") || value.startsWith("https://")
      ? new URL(value)
      : null;

    if (parsed) {
      const fromQuery = parsed.searchParams.get("qrCode");
      if (fromQuery) return decodeURIComponent(fromQuery).trim();

      const fromPath = extractFromPathname(parsed.pathname);
      if (fromPath) return fromPath;
    }
  } catch {
    // Ignore URL parsing errors and continue with regex fallback.
  }

  const qrPathMatch = value.match(/\/qr\/([^/?#]+)/i);
  if (qrPathMatch?.[1]) {
    return decodeURIComponent(qrPathMatch[1]).trim();
  }

  return "";
}

function extractFromPathname(pathname) {
  const match = String(pathname || "").match(/^\/?qr\/([^/?#]+)/i);
  if (!match?.[1]) return "";
  return decodeURIComponent(match[1]).trim();
}
