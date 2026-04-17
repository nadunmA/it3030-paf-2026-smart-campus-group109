const API_BASE = "/api";

function getToken() {
  return sessionStorage.getItem("token");
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorBody = {};
    try {
      errorBody = await response.json();
    } catch {
      errorBody = {};
    }
    const message = errorBody.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = errorBody.details || [];
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const apiGet = (path, params) => {
  if (params) {
    const qs = new URLSearchParams(params).toString();
    return request(qs ? `${path}?${qs}` : path, { method: "GET" });
  }
  return request(path, { method: "GET" });
};

export const apiPost = (path, body) =>
  request(path, { method: "POST", body: JSON.stringify(body) });

export const apiPut = (path, body) =>
  request(path, { method: "PUT", body: JSON.stringify(body) });

export const apiPatch = (path, body) =>
  request(path, { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined });

export const apiDelete = (path) => request(path, { method: "DELETE" });

export async function apiDownload(path) {
  const token = getToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE}${path}`, { headers });
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  const blob = await response.blob();
  const contentDisposition = response.headers.get("Content-Disposition") || "";
  const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  const fileName = match ? match[1].replace(/['"]/g, "") : "download";
  return { blob, fileName };
}
