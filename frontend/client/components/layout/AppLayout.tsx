import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, Briefcase, Calendar as CalIcon, PlusSquare, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/styles/layout.css";

interface AppLayoutProps { children: ReactNode }

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/customers", label: "Customer", icon: Users },
  { to: "/jobs", label: "Job", icon: Briefcase },
  { to: "/planning", label: "Planning", icon: CalIcon },
  { to: "/add-data", label: "Add Data", icon: PlusSquare },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="hidden md:flex w-64 min-h-screen bg-white border-r">
          <div className="p-4 w-full flex flex-col">
            <div className="mb-4">
              <div className="h-10 rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white flex items-center justify-center font-bold tracking-wide">Main</div>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <NavLink key={to} to={to} className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-white bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] shadow"
                      : "text-slate-600 hover:bg-slate-100",
                  )}>
                    <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-500 group-hover:text-slate-700")} />
                    <span>{label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <button onClick={() => { import("@/lib/auth").then(m => m.logout()); window.location.href = "/login"; }} className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </aside>
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b bg-white flex items-center justify-between px-4">
            <div className="text-sm text-slate-500">Role : Admin</div>
            <div className="flex items-center gap-2 text-sm text-slate-500"><span>Admin 01</span></div>
          </header>
          <main className="p-6 app-main">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
