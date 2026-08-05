"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const newErrors: Record<string, string> = {};

    // Basic Validation
    if (!data.fullName) newErrors.fullName = "Full Name is required";
    if (!data.studentId) newErrors.studentId = "Student ID is required";
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email as string)) {
      newErrors.email = "Valid University Email is required";
    }
    if (!data.phone) newErrors.phone = "Phone Number is required";
    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.course) newErrors.course = "Course is required";
    if (!data.department) newErrors.department = "Department is required";
    if (!data.academicYear) newErrors.academicYear = "Academic Year is required";
    if (!data.dob) newErrors.dob = "Date of Birth is required";
    if (!data.password || (data.password as string).length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!data.rules) newErrors.rules = "You must accept the rules";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="flex-1 flex flex-col min-h-screen bg-muted/30 items-center justify-center p-6">
        <div className="card-apple max-w-md w-full flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Registration Submitted</h1>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              Your account is awaiting verification and approval from the hostel administration.
            </p>
          </div>
          <div className="bg-muted px-4 py-3 rounded-lg w-full flex items-center justify-between border border-border/50">
            <span className="text-sm font-medium text-foreground">Status</span>
            <span className="text-sm font-semibold text-amber-500 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Pending Approval
            </span>
          </div>
          <Link href="/login" className="btn-primary w-full inline-block mt-4 text-center py-2.5">
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-muted/30">
      <header className="flex justify-between items-center w-full p-6 sm:px-12">
        <Link href="/login" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Back to Login</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-3 mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Student Registration</h1>
          <p className="text-sm text-muted-foreground">Apply for hostel accommodation</p>
        </div>

        <div className="card-apple w-full p-6 sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input name="fullName" type="text" className="w-full px-4 py-2 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                {errors.fullName && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Student ID / Enrollment Number</label>
                <input name="studentId" type="text" className="w-full px-4 py-2 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                {errors.studentId && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.studentId}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">University Email</label>
                <input name="email" type="email" className="w-full px-4 py-2 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input name="phone" type="tel" className="w-full px-4 py-2 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                {errors.phone && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select name="gender" className="w-full px-4 py-2.5 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 appearance-none">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.gender}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Date of Birth</label>
                <input name="dob" type="date" className="w-full px-4 py-2 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                {errors.dob && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.dob}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Course</label>
                <input name="course" type="text" placeholder="e.g. B.Tech, MBA" className="w-full px-4 py-2 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                {errors.course && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.course}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Department</label>
                <input name="department" type="text" placeholder="e.g. Computer Science" className="w-full px-4 py-2 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                {errors.department && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.department}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">Academic Year</label>
                <select name="academicYear" className="w-full px-4 py-2.5 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 appearance-none">
                  <option value="">Select year</option>
                  <option value="1">First Year</option>
                  <option value="2">Second Year</option>
                  <option value="3">Third Year</option>
                  <option value="4">Fourth Year</option>
                  <option value="5">Fifth Year / PG</option>
                </select>
                {errors.academicYear && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.academicYear}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <input name="password" type="password" className="w-full px-4 py-2 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                {errors.password && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <input name="confirmPassword" type="password" className="w-full px-4 py-2 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                {errors.confirmPassword && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-start space-x-3">
                <input type="checkbox" name="rules" id="rules" className="mt-1 rounded text-foreground focus:ring-foreground/20 bg-background border-border/60 w-4 h-4" />
                <label htmlFor="rules" className="text-sm text-foreground/80 cursor-pointer">
                  I accept the hostel rules, regulations, and terms of accommodation.
                </label>
              </div>
              {errors.rules && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3"/> {errors.rules}</p>}
            </div>

            <button type="submit" className="btn-primary w-full py-2.5 mt-4">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
