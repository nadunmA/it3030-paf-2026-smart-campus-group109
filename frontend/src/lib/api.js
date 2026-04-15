const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function apiRequest(method, path, payload) {
  const token = sessionStorage.getItem("token");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (payload !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(
      `GET ${path} failed: ${res.status} - ${JSON.stringify(body)}`,
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
