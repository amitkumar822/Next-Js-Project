import { connectDB } from "@/db/db";
import Project from "@/models/taskModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    // const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { title, description } = await req.json();

    console.log("Create: ", title, description);

    // if (!userId) {
    //   return NextResponse.json(
    //     { message: "UserId must be required" },
    //     { status: 400 }
    //   );
    // }

    if (!title || !description) {
      return NextResponse.json(
        { message: "title and description are required fields" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      title,
      description,
      // user: userId,
    });

    return NextResponse.json({
      message: "Project create successfully",
      project,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
