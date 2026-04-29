function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function getRequiredApiBaseUrl(): string {
  const rawValue = import.meta.env.VITE_API_BASE_URL?.trim();

  if (!rawValue) {
    throw new Error("Missing VITE_API_BASE_URL. Define it in your Netlify environment or local .env file.");
  }

  return stripTrailingSlash(rawValue);
}

export const API_BASE_URL = getRequiredApiBaseUrl();
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");

export function resolveApiUrl(input: string): string {
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }

  if (input.startsWith("/api/")) {
    return `${API_ORIGIN}${input}`;
  }

  if (input.startsWith("/")) {
    return `${API_BASE_URL}${input}`;
  }

  return `${API_BASE_URL}/${input}`;
}
