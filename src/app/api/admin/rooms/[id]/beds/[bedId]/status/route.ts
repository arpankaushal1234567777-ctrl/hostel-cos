import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Room from "@/models/Room";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; bedId: string }> }
) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id, bedId } = await params;
    const body = await req.json();
    const { status } = body;

    if (!["AVAILABLE", "MAINTENANCE"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectToDatabase();

    const room = await Room.findOneAndUpdate(
      { _id: id, "beds._id": bedId },
      { $set: { "beds.$.status": status } },
      { new: true }
    ).lean();

    if (!room) {
      return NextResponse.json({ error: "Room or bed not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, room }, { status: 200 });
  } catch (error: any) {
    console.error("Update bed status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
