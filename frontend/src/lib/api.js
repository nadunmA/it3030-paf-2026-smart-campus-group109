const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiGet(path) {
  const token = sessionStorage.getItem("token");
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers,
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
