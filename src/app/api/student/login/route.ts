import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setTokenCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/ID and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find student by either universityEmail OR studentId
    const user = await User.findOne({
      $or: [
        { universityEmail: identifier.toLowerCase() },
        { studentId: identifier }
      ],
      role: "STUDENT"
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials or account not found" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check account status
    switch (user.accountStatus) {
      case "PENDING_APPROVAL":
        return NextResponse.json(
          { error: "Your account is awaiting approval from the hostel administration." },
          { status: 403 }
        );
      case "REJECTED":
        return NextResponse.json(
          { error: "Your application has been rejected. Please contact the administration." },
          { status: 403 }
        );
      case "SUSPENDED":
        return NextResponse.json(
          { error: "Your account is suspended. Please contact the administration." },
          { status: 403 }
        );
      case "ACTIVE":
        // Proceed to login
        break;
      default:
        return NextResponse.json(
          { error: "Invalid account status." },
          { status: 403 }
        );
    }

    // Sign JWT
    const token = await signToken({
      id: user._id.toString(),
      email: user.universityEmail,
      role: user.role,
    });

    // Set cookie
    await setTokenCookie(token);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Student login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
