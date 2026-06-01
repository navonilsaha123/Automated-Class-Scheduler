const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const AI_API_BASE_URL =
  import.meta.env.VITE_AI_API_BASE_URL ?? "http://localhost:8000";

async function parseJsonSafely(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers ?? {})
    },
    ...options
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const message =
      payload?.error ||
      (typeof payload === "string" ? payload : null) ||
      "Request failed";
    throw new Error(message);
  }

  return payload;
}

export async function aiApiRequest(path, options = {}) {
  const response = await fetch(`${AI_API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    ...options
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const message =
      payload?.detail ||
      payload?.error ||
      (typeof payload === "string" ? payload : null) ||
      "AI service request failed";
    throw new Error(message);
  }

  return payload;
}

export { AI_API_BASE_URL, API_BASE_URL };
