export function isLoggedIn(): boolean {
  try {
    return typeof localStorage !== "undefined" && localStorage.getItem("auth") === "1";
  } catch {
    return false;
  }
}

export function login(username: string) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("auth", "1");
    localStorage.setItem("user", username);
  }
}

export function logout() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
  }
}
