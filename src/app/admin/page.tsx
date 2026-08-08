"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, LayoutDashboard, Building2, Users } from "lucide-react";

import { StudentsTab } from "@/components/admin/StudentsTab";
import { HostelsTab } from "@/components/admin/HostelsTab";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"STUDENTS" | "HOSTELS">("STUDENTS");
  const [adminRole, setAdminRole] = useState<string>("");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setAdminRole(data.user.role);
        }
      } catch (error) {
        console.error("Failed to fetch admin role");
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-muted/30">
      <header className="flex justify-between items-center w-full p-4 sm:p-6 sm:px-12 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-12">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-foreground hidden sm:inline-block">Admin Portal</span>
              {adminRole && (
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden sm:inline-block">
                  {adminRole === "BOYS_ADMIN" ? "Boys Hostel" : adminRole === "GIRLS_ADMIN" ? "Girls Hostel" : adminRole}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-muted/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("STUDENTS")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "STUDENTS" 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Students</span>
            </button>
            <button
              onClick={() => setActiveTab("HOSTELS")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "HOSTELS" 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Hostels & Rooms</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <ThemeToggle />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 sm:p-12 w-full max-w-7xl mx-auto">
        {activeTab === "STUDENTS" ? <StudentsTab /> : <HostelsTab />}
      </div>
    </main>
  );
}
