export interface LoginResponse {
  token: string;
  user: {
    id: number;
    fullname: string;
    role: string;
  };
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
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("username"); // เพิ่มบรรทัดนี้
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}

// เพิ่มฟังก์ชันนี้
export function getCurrentUserRole(): string | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw);
    return user?.role ?? null;
  } catch {
    return null;
  }
}