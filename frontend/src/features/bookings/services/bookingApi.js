const API_BASE = "/api/bookings";

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

    const message = errorBody.message || `Request failed with ${response.status}`;
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

export const bookingApi = {
  create(payload) {
    return request("", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAll({ date, status } = {}) {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (status) params.set("status", status);
    const query = params.toString();
    return request(query ? `?${query}` : "");
  },

  getMine() {
    return request("/me");
  },

  getByUser(userId) {
    return request(`/user/${userId}`);
  },

  approve(bookingId, reason = "") {
    return request(`/${bookingId}/approve`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  reject(bookingId, reason = "") {
    return request(`/${bookingId}/reject`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  cancel(bookingId) {
    return request(`/${bookingId}/cancel`, {
      method: "PATCH",
    });
  },
};
