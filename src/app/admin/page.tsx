"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

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
      <header className="flex justify-between items-center w-full p-6 sm:px-12 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">Admin Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 sm:p-12 w-full max-w-7xl mx-auto">
        <div className="card-apple p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Welcome, Administrator</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            This is a temporary dashboard. In the future, this space will contain powerful tools for overseeing rooms, verifying student accounts, and managing hostel operations.
          </p>
        </div>
      </div>
    </main>
  );
}
