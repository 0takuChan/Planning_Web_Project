import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User, LogOut, Settings, ChevronDown, UserCircle, ShieldCheck, Calendar as CalIcon, ClipboardList, Package, Key } from "lucide-react";
import { logout } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

// Role icon mapping
const getRoleIcon = (role: string) => {
  const roleLower = role.toLowerCase();
  switch (roleLower) {
    case "admin":
      return ShieldCheck;
    case "planner":
      return CalIcon;
    case "orderer":
      return Package;
    case "recorder":
      return ClipboardList;
    default:
      return UserCircle;
  }
};

export default function Navbar() {
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        setUserId(user.id || null);
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

  const handleResetPassword = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      toast({
        title: "กรุณากรอกรหัสผ่านปัจจุบัน",
        variant: "destructive",
      });
      return;
    }

    if (!passwordData.newPassword) {
      toast({
        title: "กรุณากรอกรหัสผ่านใหม่",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "รหัสผ่านใหม่และการยืนยันไม่ตรงกัน",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "ไม่พบข้อมูลผู้ใช้",
        description: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // ขั้นแรก: ตรวจสอบรหัสผ่านปัจจุบันโดยพยายาม login
      const loginResponse = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"), // ต้องเก็บ username ไว้ใน localStorage
          password: passwordData.currentPassword,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("รหัสผ่านปัจจุบันไม่ถูกต้อง");
      }

      // ขั้นที่สอง: อัพเดทรหัสผ่านใหม่
      const updateResponse = await fetch(`http://localhost:4000/api/employee/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: userName,
          email: userEmail,
          phone: userPhone,
          password: passwordData.newPassword, // API จะ hash ให้เอง
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update password");
      }

      toast({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        description: "รหัสผ่านของคุณได้รับการเปลี่ยนแปลงแล้ว",
        variant: "default",
      });

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsResetPasswordOpen(false);

    } catch (error: any) {
      console.error("Reset password error:", error);
      toast({
        title: "เปลี่ยนรหัสผ่านไม่สำเร็จ",
        description: error.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  const RoleIcon = getRoleIcon(userRole);

  return (
    <>
      <header className="h-14 border-b bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <RoleIcon className="h-4 w-4" />
          <span>Role: {getRoleDisplayName(userRole)}</span>
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
            
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => setIsResetPasswordOpen(true)}
            >
              <Key className="mr-2 h-4 w-4" />
              <span>เปลี่ยนรหัสผ่าน</span>
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

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              เปลี่ยนรหัสผ่าน
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                รหัสผ่านปัจจุบัน
              </label>
              <Input
                type="password"
                placeholder="กรอกรหัสผ่านปัจจุบัน"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value
                })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">
                รหัสผ่านใหม่
              </label>
              <Input
                type="password"
                placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value
                })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">
                ยืนยันรหัสผ่านใหม่
              </label>
              <Input
                type="password"
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value
                })}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsResetPasswordOpen(false);
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="flex-1"
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleResetPassword}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}