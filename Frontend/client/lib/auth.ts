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

  // เก็บ token ไว้ localStorage
  localStorage.setItem("token", data.token);

  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isLoggedIn(): boolean {
  // ตรวจสอบว่ามี token อยู่ใน localStorage หรือไม่
  return !!localStorage.getItem("token");
}