"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  LogOut, LayoutDashboard, Users, UserCheck, 
  UserX, Clock, Eye, Check, X, Loader2 
} from "lucide-react";

interface Stats {
  total: number;
  pending: number;
  active: number;
  rejected: number;
}

interface Student {
  _id: string;
  fullName: string;
  studentId: string;
  universityEmail: string;
  phoneNumber: string;
  gender: string;
  course: string;
  department: string;
  academicYear: string;
  dateOfBirth: string;
  accountStatus: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalType, setModalType] = useState<"VIEW" | "APPROVE" | "REJECT" | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/students");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setStats(data.stats);
      setStudents(data.students);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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

  const handleAction = async (id: string, status: "ACTIVE" | "REJECTED") => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/students/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // Optimistic update
        setStudents((prev) => 
          prev.map((s) => s._id === id ? { ...s, accountStatus: status } : s)
        );
        // Recalculate stats optimistically
        if (stats) {
          const oldStudent = students.find((s) => s._id === id);
          if (oldStudent && oldStudent.accountStatus === "PENDING_APPROVAL") {
            setStats({
              ...stats,
              pending: Math.max(0, stats.pending - 1),
              active: status === "ACTIVE" ? stats.active + 1 : stats.active,
              rejected: status === "REJECTED" ? stats.rejected + 1 : stats.rejected,
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
      closeModal();
    }
  };

  const openModal = (student: Student, type: "VIEW" | "APPROVE" | "REJECT") => {
    setSelectedStudent(student);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setModalType(null);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "ACTIVE": return <span className="px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-xs font-medium border border-green-500/20">Active</span>;
      case "PENDING_APPROVAL": return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-xs font-medium border border-amber-500/20">Pending</span>;
      case "REJECTED": return <span className="px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md text-xs font-medium border border-red-500/20">Rejected</span>;
      case "SUSPENDED": return <span className="px-2.5 py-1 bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 rounded-md text-xs font-medium border border-neutral-500/20">Suspended</span>;
      default: return <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-md text-xs font-medium border border-border">{status}</span>;
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
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 sm:p-12 w-full max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Overview of student applications and statuses.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="card-apple p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center border border-blue-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Total Students</span>
                </div>
                <div className="text-3xl font-semibold tracking-tight">{stats?.total || 0}</div>
              </div>

              <div className="card-apple p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center border border-amber-500/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Pending</span>
                </div>
                <div className="text-3xl font-semibold tracking-tight">{stats?.pending || 0}</div>
              </div>

              <div className="card-apple p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center border border-green-500/20">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Active</span>
                </div>
                <div className="text-3xl font-semibold tracking-tight">{stats?.active || 0}</div>
              </div>

              <div className="card-apple p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center border border-red-500/20">
                    <UserX className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Rejected</span>
                </div>
                <div className="text-3xl font-semibold tracking-tight">{stats?.rejected || 0}</div>
              </div>
            </div>

            {/* Students Table */}
            <div className="card-apple overflow-hidden">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-lg font-semibold tracking-tight">Student Applications</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Enrollment No.</th>
                      <th className="px-6 py-4 font-medium">Course/Dept</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                          No students registered yet.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student._id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">{student.fullName}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{student.universityEmail}</div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs">{student.studentId}</td>
                          <td className="px-6 py-4">
                            <div>{student.course}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{student.department}</div>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(student.accountStatus)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => openModal(student, "VIEW")}
                                className="p-2 bg-background border border-border/60 hover:bg-muted text-foreground rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {student.accountStatus === "PENDING_APPROVAL" && (
                                <>
                                  <button 
                                    onClick={() => openModal(student, "APPROVE")}
                                    className="p-2 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg transition-colors"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => openModal(student, "REJECT")}
                                    className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {selectedStudent && modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card-apple bg-background w-full max-w-lg overflow-hidden shadow-2xl border-border/60 animate-in zoom-in-95 duration-200">
            
            {modalType === "VIEW" && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                  <h3 className="text-lg font-semibold tracking-tight">Student Details</h3>
                  <button onClick={closeModal} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Full Name</div>
                      <div className="font-medium">{selectedStudent.fullName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Enrollment Number</div>
                      <div className="font-mono">{selectedStudent.studentId}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">University Email</div>
                      <div>{selectedStudent.universityEmail}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Phone Number</div>
                      <div>{selectedStudent.phoneNumber}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Course & Year</div>
                      <div>{selectedStudent.course} ({selectedStudent.academicYear})</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Department</div>
                      <div>{selectedStudent.department}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Gender</div>
                      <div className="capitalize">{selectedStudent.gender}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Registration Date</div>
                      <div>{new Date(selectedStudent.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                    <div className="text-sm font-medium">Status:</div>
                    {getStatusBadge(selectedStudent.accountStatus)}
                  </div>
                </div>
                <div className="p-6 bg-muted/30 border-t border-border/50 flex justify-end">
                  <button onClick={closeModal} className="px-4 py-2 bg-background border border-border/60 hover:bg-muted text-sm font-medium rounded-lg transition-colors">
                    Close
                  </button>
                </div>
              </>
            )}

            {modalType === "APPROVE" && (
              <div className="p-6 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">Approve Application</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Are you sure you want to approve <span className="font-medium text-foreground">{selectedStudent.fullName}</span>? This will grant them active access to the portal.
                </p>
                <div className="flex gap-3 w-full justify-center">
                  <button 
                    onClick={closeModal} 
                    className="flex-1 px-4 py-2.5 bg-background border border-border/60 hover:bg-muted text-sm font-medium rounded-lg transition-colors"
                    disabled={actionLoading === selectedStudent._id}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleAction(selectedStudent._id, "ACTIVE")} 
                    className="flex-1 px-4 py-2.5 bg-green-500 text-white hover:bg-green-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                    disabled={actionLoading === selectedStudent._id}
                  >
                    {actionLoading === selectedStudent._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Approve"}
                  </button>
                </div>
              </div>
            )}

            {modalType === "REJECT" && (
              <div className="p-6 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <X className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-2">Reject Application</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Are you sure you want to reject <span className="font-medium text-foreground">{selectedStudent.fullName}</span>? This will block their access to the portal.
                </p>
                <div className="flex gap-3 w-full justify-center">
                  <button 
                    onClick={closeModal} 
                    className="flex-1 px-4 py-2.5 bg-background border border-border/60 hover:bg-muted text-sm font-medium rounded-lg transition-colors"
                    disabled={actionLoading === selectedStudent._id}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleAction(selectedStudent._id, "REJECTED")} 
                    className="flex-1 px-4 py-2.5 bg-red-500 text-white hover:bg-red-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                    disabled={actionLoading === selectedStudent._id}
                  >
                    {actionLoading === selectedStudent._id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Reject"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
}
