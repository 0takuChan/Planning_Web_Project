import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import Jobs from "./pages/Jobs";
import Planning from "./pages/Planning";
import AddData from "./pages/AddData";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import { toast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

import { isLoggedIn, getCurrentUserRole } from "./lib/auth";

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

type RoleKey = "admin" | "planner" | "orderer" | "recorder" | string;

interface PermissionsContextValue {
  role: RoleKey | null;
  canEdit: (pageKey: string) => boolean;
  canView: (pageKey: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextValue>({
  role: null,
  canEdit: () => false,
  canView: () => false,
});

export const usePermissions = () => useContext(PermissionsContext);

const ALL_ROLES: RoleKey[] = ["Admin", "Planner", "Orderer", "Recorder"];

const PAGE_PERMISSIONS: Record<string, { view: RoleKey[], edit: RoleKey[] }> = {
  "/": {
    view: ALL_ROLES,
    edit: ALL_ROLES,
  },
  "/customers": {
    view: ALL_ROLES,
    edit: ["Admin", "Orderer"],
  },
  "/jobs": {
    view: ALL_ROLES,
    edit: ["Admin", "Orderer"],
  },
  "/planning": {
    view: ALL_ROLES,
    edit: ["Admin", "Planner"],
  },
  "/add-data": {
    view: ALL_ROLES,
    edit: ["Admin", "Recorder"],
  },
  "/admin": {
    view: ["Admin"],
    edit: ["Admin"],
  },
};

function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  return !isLoggedIn() ? children : <Navigate to="/" replace />;
}

function RoleBasedRoute({ children, path }: { children: JSX.Element; path: string }) {
  const role = getCurrentUserRole()?.toLowerCase();
  
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  
  const permissions = PAGE_PERMISSIONS[path];
  
  if (!permissions) {
    return role === "admin" ? children : <Navigate to="/" replace />;
  }
  
  const canView = permissions.view.some(r => r.toLowerCase() === role);
  
  if (!canView) {
    // แสดง toast notification สำหรับ admin page
    if (path === "/admin") {
      toast({
        title: "Access Denied",
        description: "คุณไม่มีสิทธิ์เข้าถึงหน้า Admin เฉพาะผู้ดูแลระบบเท่านั้น",
        variant: "destructive",
      });
    }
    
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default function App() {
  const [role, setRole] = useState<RoleKey | null>(() => getCurrentUserRole());

  // Sync role กับ localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    const checkRole = () => {
      const currentRole = getCurrentUserRole();
      if (currentRole !== role) {
        setRole(currentRole);
      }
    };

    // เช็คทุกครั้งที่ component mount และเมื่อ storage เปลี่ยน
    checkRole();
    window.addEventListener('storage', checkRole);
    
    // เช็คทุก 100ms ในกรณี localStorage เปลี่ยนใน tab เดียวกัน (storage event ไม่ fire)
    const interval = setInterval(checkRole, 100);

    return () => {
      window.removeEventListener('storage', checkRole);
      clearInterval(interval);
    };
  }, [role]);

  const ctxValue = useMemo<PermissionsContextValue>(() => {
    return {
      role,
      canView: (pageKey: string) => {
        if (!role) return false;
        const roleLc = String(role).toLowerCase();
        const permissions = PAGE_PERMISSIONS[pageKey];
        
        if (!permissions) return roleLc === "admin";
        
        return permissions.view.some(r => r.toLowerCase() === roleLc);
      },
      canEdit: (pageKey: string) => {
        if (!role) return false;
        const roleLc = String(role).toLowerCase();
        const permissions = PAGE_PERMISSIONS[pageKey];
        
        if (!permissions) return roleLc === "admin";
        
        return permissions.edit.some(r => r.toLowerCase() === roleLc);
      },
    };
  }, [role]);

  return (
    <QueryClientProvider client={queryClient}>
      <PermissionsContext.Provider value={ctxValue}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

              <Route path="/" element={<RoleBasedRoute path="/"><Index /></RoleBasedRoute>} />
              <Route path="/customers" element={<RoleBasedRoute path="/customers"><Customers /></RoleBasedRoute>} />
              <Route path="/jobs" element={<RoleBasedRoute path="/jobs"><Jobs /></RoleBasedRoute>} />
              <Route path="/planning" element={<RoleBasedRoute path="/planning"><Planning /></RoleBasedRoute>} />
              <Route path="/add-data" element={<RoleBasedRoute path="/add-data"><AddData /></RoleBasedRoute>} />
              <Route path="/admin" element={<RoleBasedRoute path="/admin"><Admin /></RoleBasedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PermissionsContext.Provider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
