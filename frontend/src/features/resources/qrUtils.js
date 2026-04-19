export function extractQrLookupValue(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";

  const fromUrl = extractFromQrUrl(raw);
  if (fromUrl) return fromUrl;

  return raw;
}

export function isLikelyResourceId(value) {
  return /^[a-f\d]{24}$/i.test(String(value || "").trim());
}

function safeDecode(value) {
  try {
    return decodeURIComponent(String(value || "")).trim();
  } catch {
    return String(value || "").trim();
  }
}

function extractFromQrUrl(value) {
  try {
    const parsed = value.startsWith("http://") || value.startsWith("https://")
      ? new URL(value)
      : null;

    if (parsed) {
      const fromQuery = parsed.searchParams.get("qrCode");
      if (fromQuery) return safeDecode(fromQuery);

      const fromPath = extractFromPathname(parsed.pathname);
      if (fromPath) return fromPath;
    }
  } catch {
    // Ignore URL parsing errors and continue with regex fallback.
  }

  const qrPathMatch = value.match(/\/qr\/([^/?#]+)/i);
  if (qrPathMatch?.[1]) {
    return safeDecode(qrPathMatch[1]);
  }

  return "";
}

function extractFromPathname(pathname) {
  const match = String(pathname || "").match(/^\/?qr\/([^/?#]+)/i);
  if (!match?.[1]) return "";
  return safeDecode(match[1]);
}
