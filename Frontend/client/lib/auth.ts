export interface LoginResponse {
  token: string;
  user: {
    id: number;
    fullname: string;
    role: string;
  };
}

interface JwtTokenPayload {
  id: number;
  username: string;
  role: string;
  exp?: number;
  iat?: number;
}

function clearStoredAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("username");
}

function decodeJwtPayload(token: string): JwtTokenPayload | null {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length < 2) {
      return null;
    }

    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decodedText = atob(paddedBase64);
    return JSON.parse(decodedText) as JwtTokenPayload;
  } catch {
    return null;
  }
}

export function getTokenPayload(): JwtTokenPayload | null {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  return decodeJwtPayload(token);
}

function isTokenExpired(payload: JwtTokenPayload | null): boolean {
  if (!payload?.exp) {
    return true;
  }

  const currentUnixTime = Math.floor(Date.now() / 1000);
  return payload.exp <= currentUnixTime;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch("http://localhost:4000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  const data: LoginResponse = await res.json();

  // เก็บ token, user และ username ไว้ localStorage
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("username", username); // เพิ่มบรรทัดนี้

  return data;
}

export function logout() {
  clearStoredAuth();
}

export function getToken() {
  const token = localStorage.getItem("token");
  const payload = token ? decodeJwtPayload(token) : null;

  if (!token || isTokenExpired(payload)) {
    clearStoredAuth();
    return null;
  }

  return token;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getCurrentUserRole(): string | null {
  const tokenPayload = getTokenPayload();
  if (tokenPayload && !isTokenExpired(tokenPayload)) {
    return tokenPayload.role ?? null;
  }

  const rawUser = localStorage.getItem("user");
  if (!rawUser) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser);
    return user?.role ?? null;
  } catch {
    return null;
  }
}