const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 8000);

async function apiRequest(method, path, payload) {
  const token = sessionStorage.getItem("token");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (payload !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: payload === undefined ? undefined : JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`${method} ${path} timed out after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(
      `${method} ${path} failed: ${res.status} - ${JSON.stringify(body)}`,
    );
  }

  return body;
}

export async function apiGet(path) {
  return apiRequest("GET", path);
}

export async function apiPost(path, payload) {
  return apiRequest("POST", path, payload);
}

export async function apiPut(path, payload) {
  return apiRequest("PUT", path, payload);
}

export async function apiPatch(path, payload) {
  return apiRequest("PATCH", path, payload);
}

export async function apiDelete(path) {
  return apiRequest("DELETE", path);
}

export async function apiDownload(path) {
  const token = sessionStorage.getItem("token");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers,
      credentials: "include",
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`GET ${path} timed out after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} - ${text}`);
  }

  const contentDisposition = res.headers.get("content-disposition") || "";
  const fileNameMatch = contentDisposition.match(/filename=\"?([^\";]+)\"?/i);
  const fileName = fileNameMatch?.[1] || "download.bin";
  const blob = await res.blob();

  return { blob, fileName };
}
