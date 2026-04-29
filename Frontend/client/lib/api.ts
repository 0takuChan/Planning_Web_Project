import { getToken, logout } from "@/lib/auth";
import { API_BASE_URL, resolveApiUrl } from "@/lib/api-config";

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