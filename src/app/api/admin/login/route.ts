import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setTokenCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ 
      universityEmail: email.toLowerCase(),
      role: "ADMIN"
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials or unauthorized" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials or unauthorized" },
        { status: 401 }
      );
    }

    if (user.accountStatus !== "ACTIVE") {
      return NextResponse.json(
        { error: `Account is ${user.accountStatus.toLowerCase()}` },
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
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
