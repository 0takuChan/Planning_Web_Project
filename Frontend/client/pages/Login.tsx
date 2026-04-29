import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "@/components/layout/BrandLogo";
import { login, isLoggedIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import "@/styles/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const user = await login(username, password);
      navigate("/", { replace: true }); // redirect หลัง login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-4 login-page">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-6 card">
        <div className="mb-5 flex justify-center">
          <BrandLogo className="justify-center" />
        </div>
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
