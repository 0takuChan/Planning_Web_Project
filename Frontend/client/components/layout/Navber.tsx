import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { logout } from "@/lib/auth";
import "@/styles/layout.css";

interface AppLayoutProps {
  children: ReactNode;
}

export default function Navbar({ children }: AppLayoutProps) {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.fullname || "User");
        setUserRole(user.role || "");
        setUserEmail(user.email || "");
        setUserPhone(user.phone || "");
        console.log("User data:", user); // Debug log
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getRoleDisplayName = (role: string): string => {
    const roleMap: Record<string, string> = {
      "Admin": "ผู้ดูแลระบบ",
      "Planner": "ผู้วางแผน",
      "Orderer": "ผู้รับออเดอร์",
      "Recorder": "ผู้บันทึกข้อมูล"
    };
    return roleMap[role] || role;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b bg-white flex items-center justify-between px-4">
            <div className="text-sm text-slate-500">
              Role: {getRoleDisplayName(userRole)}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 px-3 hover:bg-slate-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(userName)}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-slate-700">
                      {userName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {getRoleDisplayName(userRole)}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail || "ไม่พบข้อมูลอีเมล"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userPhone || "ไม่พบข้อมูลเบอร์โทร"}
                    </p>
                    <p className="text-xs leading-none text-blue-600 font-medium">
                      {getRoleDisplayName(userRole)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>ข้อมูลส่วนตัว</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>ตั้งค่า</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="p-6 app-main">{children}</main>
        </div>
      </div>
    </div>
  );
}