import { ThemeToggle } from "@/components/theme-toggle";
import { Bed, Users, LayoutDashboard, Settings } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen pt-12 pb-24 px-6 sm:px-12 items-center">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-16">
        
        {/* Header / Nav area */}
        <header className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center text-background shadow-sm">
              <Bed className="w-6 h-6" />
            </div>
            <span className="font-semibold text-lg tracking-tight">HostelSys</span>
          </div>
          <ThemeToggle />
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-6 mt-12 md:mt-24">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-3xl leading-tight">
            Hostel Management System
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
            Smart, simple hostel management for students and administrators.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button className="btn-primary">
              Get Started
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
        </section>

        {/* Design System Preview (Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl mx-auto">
          {/* Card 1 */}
          <div className="card-apple flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center mb-2">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-foreground">Student Portal</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A clean interface for students to manage their stays, requests, and payments.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card-apple flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center mb-2">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-foreground">Admin Dashboard</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Powerful tools for administrators to oversee rooms, maintenance, and staff.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card-apple flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center mb-2">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1 text-foreground">Easy Settings</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Configure everything from room types to automated alerts without the hassle.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
