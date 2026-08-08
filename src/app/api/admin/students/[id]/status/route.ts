import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || (payload.role !== "BOYS_ADMIN" && payload.role !== "GIRLS_ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    if (!["ACTIVE", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Wait for params in Next.js 15+ (params is a Promise)
    const { id } = await params;

    await connectToDatabase();

    const genderFilter = payload.role === "BOYS_ADMIN" ? "male" : "female";

    const student = await User.findOneAndUpdate(
      { _id: id, role: "STUDENT", gender: genderFilter },
      { $set: { accountStatus: status } },
      { new: true }
    ).select("-passwordHash").lean();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, student }, { status: 200 });
  } catch (error: any) {
    console.error("Update student status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
