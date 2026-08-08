import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || (payload.role !== "BOYS_ADMIN" && payload.role !== "GIRLS_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const genderFilter = payload.role === "BOYS_ADMIN" ? "male" : "female";

    const students = await User.find({ role: "STUDENT", gender: genderFilter })
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    const stats = {
      total: students.length,
      pending: students.filter((s) => s.accountStatus === "PENDING_APPROVAL").length,
      active: students.filter((s) => s.accountStatus === "ACTIVE").length,
      rejected: students.filter((s) => s.accountStatus === "REJECTED").length,
    };

    return NextResponse.json({ stats, students, adminRole: payload.role }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch students error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
