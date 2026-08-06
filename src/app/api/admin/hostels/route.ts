import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Hostel from "@/models/Hostel";
import Room from "@/models/Room";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const hostels = await Hostel.find().lean();
    const rooms = await Room.find().lean();

    const hostelStats = hostels.map((hostel) => {
      const hostelRooms = rooms.filter(
        (r) => r.hostel.toString() === hostel._id.toString()
      );

      let occupiedBeds = 0;
      let availableBeds = 0;

      hostelRooms.forEach((room) => {
        room.beds.forEach((bed) => {
          if (bed.status === "OCCUPIED" || bed.status === "RESERVED") {
            occupiedBeds += 1;
          } else if (bed.status === "AVAILABLE") {
            availableBeds += 1;
          }
        });
      });

      const occupancyPercentage = 
        hostel.totalCapacity > 0 
          ? Math.round((occupiedBeds / hostel.totalCapacity) * 100) 
          : 0;

      return {
        ...hostel,
        occupiedBeds,
        availableBeds,
        occupancyPercentage,
      };
    });

    return NextResponse.json({ hostels: hostelStats }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch hostels error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
