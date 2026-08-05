import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { Bed, User as UserIcon, BookOpen, Calendar, ShieldCheck } from "lucide-react";

export default async function StudentDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyToken(token);

  if (!payload || payload.role !== "STUDENT") {
    redirect("/login");
  }

  await connectToDatabase();
  const student = await User.findById(payload.id).lean();

  if (!student) {
    redirect("/login");
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-muted/30">
      <header className="flex justify-between items-center w-full p-6 sm:px-12 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center text-background">
            <Bed className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">Student Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </header>

      <div className="flex-1 p-6 sm:p-12 w-full max-w-4xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="card-apple p-8 sm:p-12 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center border border-border shrink-0">
            <UserIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Welcome, {student.fullName}
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your hostel application and details.
            </p>
          </div>
        </div>

        {/* Student Details Grid */}
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-4 px-1">Your Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="card-apple p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Enrollment Number</div>
                <div className="font-mono font-medium">{student.studentId}</div>
              </div>
            </div>

            <div className="card-apple p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Course</div>
                <div className="font-medium">{student.course}</div>
              </div>
            </div>

            <div className="card-apple p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center shrink-0 border border-green-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Academic Year</div>
                <div className="font-medium">{student.academicYear}</div>
              </div>
            </div>

            <div className="card-apple p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center shrink-0 border border-indigo-500/20">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Account Status</div>
                <div className="font-medium text-indigo-600 dark:text-indigo-400 capitalize">
                  {student.accountStatus.replace("_", " ").toLowerCase()}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
