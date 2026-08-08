import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/models/Room";
import Hostel from "@/models/Hostel";
import { verifyToken } from "@/lib/auth";

export async function GET(
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

    const { id } = await params;

    await connectToDatabase();

    // Verify hostel belongs to admin's gender
    const hostel = await Hostel.findById(id).lean();
    if (!hostel) {
      return NextResponse.json({ error: "Hostel not found" }, { status: 404 });
    }

    const expectedGender = payload.role === "BOYS_ADMIN" ? "MALE" : "FEMALE";
    if (hostel.genderAllowed !== expectedGender) {
      return NextResponse.json({ error: "Forbidden: Wrong admin role for this hostel" }, { status: 403 });
    }

    // Fetch all rooms for the given hostel, sorting by roomNumber ascending
    const rooms = await Room.find({ hostel: id })
      .sort({ roomNumber: 1 })
      .lean();

    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
