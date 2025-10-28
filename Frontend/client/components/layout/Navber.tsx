import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "@/styles/layout.css";

interface AppLayoutProps {
  children: ReactNode;
}

export default function Navbar({ children }: AppLayoutProps) {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.fullname || "User");
        setUserRole(user.role || "");
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b bg-white flex items-center justify-between px-4">
            <div className="text-sm text-slate-500">
              Role: {userRole}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{userName}</span>
            </div>
          </header>
          <main className="p-6 app-main">{children}</main>
        </div>
      </div>
    </div>
  );
}