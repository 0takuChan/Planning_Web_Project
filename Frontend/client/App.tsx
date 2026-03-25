import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import Jobs from "./pages/Jobs";
import Planning from "./pages/Planning";
import AddData from "./pages/AddData";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Summary from "./pages/Summary";
import Steps from "./pages/Steps"; // เพิ่ม import
import Transportation from "@/pages/Transportation";
import TransportationDetail from "@/pages/TransportationDetail";
import PageTransition from "@/components/layout/PageTransition";
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
  "/summary": {
    view: ALL_ROLES,
    edit: ALL_ROLES,
  },
  "/steps": { // เพิ่ม permissions สำหรับ steps page
    view: ALL_ROLES,
    edit: ["Admin"],
  },
  "/transportation": {
    view: ALL_ROLES,
    edit: ["Admin", "Planner"],
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

function withPageTransition(children: JSX.Element) {
  return <PageTransition>{children}</PageTransition>;
}

function AnimatedAppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PublicRoute>{withPageTransition(<Login />)}</PublicRoute>} />

        <Route path="/" element={<RoleBasedRoute path="/">{withPageTransition(<Index />)}</RoleBasedRoute>} />
        <Route path="/customers" element={<RoleBasedRoute path="/customers">{withPageTransition(<Customers />)}</RoleBasedRoute>} />
        <Route path="/jobs" element={<RoleBasedRoute path="/jobs">{withPageTransition(<Jobs />)}</RoleBasedRoute>} />
        <Route path="/planning" element={<RoleBasedRoute path="/planning">{withPageTransition(<Planning />)}</RoleBasedRoute>} />
        <Route path="/add-data" element={<RoleBasedRoute path="/add-data">{withPageTransition(<AddData />)}</RoleBasedRoute>} />
        <Route path="/summary" element={<RoleBasedRoute path="/summary">{withPageTransition(<Summary />)}</RoleBasedRoute>} />
        <Route path="/steps" element={<RoleBasedRoute path="/steps">{withPageTransition(<Steps />)}</RoleBasedRoute>} />
        <Route path="/transportation" element={<RoleBasedRoute path="/transportation">{withPageTransition(<Transportation />)}</RoleBasedRoute>} />
        <Route
          path="/transportation/:shipmentId"
          element={<RoleBasedRoute path="/transportation">{withPageTransition(<TransportationDetail />)}</RoleBasedRoute>}
        />
        <Route path="/admin" element={<RoleBasedRoute path="/admin">{withPageTransition(<Admin />)}</RoleBasedRoute>} />
        <Route path="*" element={withPageTransition(<NotFound />)} />
      </Routes>
    </AnimatePresence>
  );
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
            <AnimatedAppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </PermissionsContext.Provider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
