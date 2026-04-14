const BASE_URL = "http://localhost:8080/api";

export async function apiGet(path) {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}
