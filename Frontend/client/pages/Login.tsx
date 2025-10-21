import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import "@/styles/login.css";

export default function Login() {
  const [username, setUsername] = useState("Admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const user = await login(username, password);
      console.log("Logged in user:", user);
      navigate("/", { replace: true }); // redirect หลัง login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-4 login-page">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6 card">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm-3 8V6a3 3 0 0 1 6 0v3H9Z"/>
          </svg>
        </div>
        <h1 className="text-center text-lg font-bold">Welcome Back</h1>
        <p className="text-center text-sm text-slate-500 mb-4">
          Sign in to continue to your account.
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))]"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
