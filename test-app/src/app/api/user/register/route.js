import { connectDB } from "@/db/db";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password, fullName } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { message: "Full name, Email and Password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).lean();
    if (user) {
      return NextResponse.json(
        { message: `User already register with this email ${email}` },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    return NextResponse.json(
      {
        message: "User created successfull",
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
