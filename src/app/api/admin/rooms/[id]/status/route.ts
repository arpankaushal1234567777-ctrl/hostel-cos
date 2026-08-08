import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/models/Room";
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

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["AVAILABLE", "MAINTENANCE"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();

    const roomToUpdate = await Room.findById(id).populate("hostel").lean();
    if (!roomToUpdate) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const expectedGender = payload.role === "BOYS_ADMIN" ? "MALE" : "FEMALE";
    if ((roomToUpdate.hostel as any).genderAllowed !== expectedGender) {
      return NextResponse.json({ error: "Forbidden: Wrong admin role for this room" }, { status: 403 });
    }

    const room = await Room.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();

    return NextResponse.json({ success: true, room }, { status: 200 });
  } catch (error: any) {
    console.error("Update room status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
