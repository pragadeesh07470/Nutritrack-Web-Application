export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("nt_token");

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}
