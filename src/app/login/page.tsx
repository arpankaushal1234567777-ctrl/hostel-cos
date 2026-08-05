"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bed, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-muted/30">
      {/* Header */}
      <header className="flex justify-between items-center w-full p-6 sm:px-12">
        <Link href="/" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Back</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Login Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 w-full max-w-md mx-auto">
        
        {/* Logo & Title */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-12 h-12 bg-foreground rounded-2xl flex items-center justify-center text-background shadow-sm">
            <Bed className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your student portal</p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="card-apple w-full p-6 sm:p-8">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Email / ID */}
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="text-sm font-medium text-foreground">
                University ID / Email
              </label>
              <input 
                id="identifier"
                type="text" 
                placeholder="e.g. s1234567 or email@uni.edu"
                className="w-full px-4 py-2.5 rounded-lg border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="#" className="text-xs text-foreground/60 hover:text-foreground font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-2.5 rounded-lg border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2 pt-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="rounded text-foreground focus:ring-foreground/20 bg-background border-border/60 w-4 h-4"
              />
              <label htmlFor="remember" className="text-sm text-foreground/80 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary w-full mt-2 py-2.5">
              Sign In
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            New student?{" "}
            <Link href="#" className="text-foreground font-medium hover:underline underline-offset-4">
              Register here
            </Link>
          </div>
        </div>

        {/* Subtle Message */}
        <p className="mt-8 text-xs text-center text-muted-foreground/80 max-w-sm px-4">
          Only students verified by the hostel administration can access the portal.
        </p>
      </div>
    </main>
  );
}
