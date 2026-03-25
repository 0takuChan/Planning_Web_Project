import { ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Briefcase, Calendar as CalIcon, PlusSquare, ShieldCheck, LogOut, BarChart3, Settings, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth";
import Navbar from "./Navbar";
import "@/styles/layout.css";
import "@/styles/sidebar.css";

interface AppLayoutProps { 
  children?: ReactNode;
}

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/customers", label: "Customer", icon: Users },
  { to: "/jobs", label: "Job", icon: Briefcase },
  { to: "/planning", label: "Planning", icon: CalIcon },
  { to: "/add-data", label: "Production Log", icon: PlusSquare },
  { to: "/summary", label: "Summary", icon: BarChart3 },
  { to: "/steps", label: "Steps", icon: Settings },
  { to: "/transportation", label: "Transportation", icon: Truck },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
];

export default function Sidebar({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen relative isolate">
        <aside 
          className={cn(
            "sidebar-docked hidden md:flex h-screen sticky top-0 self-start bg-white border-r transition-all duration-300 overflow-hidden",
            isCollapsed ? "w-16" : "w-64"
          )}
          onMouseEnter={() => setIsCollapsed(false)}
          onMouseLeave={() => setIsCollapsed(true)}
        >
          <div className="p-4 w-full flex flex-col">
            {!isCollapsed && (
              <div className="mb-4">
                <div className="h-10 rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white flex items-center justify-center font-bold tracking-wide">
                  Main
                </div>
              </div>
            )}
            <nav className="flex-1 space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap overflow-hidden",
                      isCollapsed ? "justify-center" : "gap-3",
                      active
                        ? "text-white bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] shadow"
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                    title={isCollapsed ? label : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        active ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                      )}
                    />
                    {!isCollapsed && <span className="truncate">{label}</span>}
                  </NavLink>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className={cn(
                "mt-4 flex items-center rounded-lg px-3 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 whitespace-nowrap overflow-hidden",
                isCollapsed ? "justify-center" : "gap-3"
              )}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">Logout</span>}
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen min-w-0 relative z-0 isolate">
          <Navbar />
          <main className="p-6 app-main relative z-0">{children}</main>
        </div>
      </div>
    </div>
  );
}