// Small API helpers used by the single-page BrickShare dashboard.

const API_BASE_URL = "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.reason || "BrickShare API request failed.");
  }

  return data;
}

export function getDashboard() {
  return request("/dashboard");
}

export function placeOrder(order) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function distributeRentalIncome(propertyId) {
  return request("/rent/distribute", {
    method: "POST",
    body: JSON.stringify({ propertyId }),
  });
}

export function claimRentalIncome(userId) {
  return request("/rent/claim", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export function resetDemo() {
  return request("/reset", {
    method: "POST",
  });
}
