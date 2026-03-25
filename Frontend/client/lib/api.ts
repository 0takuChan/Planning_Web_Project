import { getToken, logout } from "@/lib/auth";

const API_BASE_URL = "http://localhost:4000/api";

function resolveApiUrl(input: string): string {
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }

  if (input.startsWith("/api/")) {
    return `http://localhost:4000${input}`;
  }

  if (input.startsWith("/")) {
    return `${API_BASE_URL}${input}`;
  }

  return `${API_BASE_URL}/${input}`;
}

function shouldAttachToken(url: string): boolean {
  return url.startsWith(API_BASE_URL) && !url.endsWith("/login");
}

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const url = resolveApiUrl(input);
  const headers = new Headers(init.headers);

  if (shouldAttachToken(url)) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    logout();
  }

  return response;
}