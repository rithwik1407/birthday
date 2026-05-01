import { connectToDatabase } from "@/lib/db";
import { GameCompletion } from "@/lib/models/GameCompletion";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-secret";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      // Return default completion message if no DB
      return NextResponse.json({
        title: "Congratulations!",
        message: "You completed the memory match game! 🎉",
        videoUrl: "",
        thumbnail: "",
      });
    }

    const completion = await GameCompletion.findOne({ isActive: true });
    
    if (!completion) {
      return NextResponse.json({
        title: "Congratulations!",
        message: "You completed the memory match game! 🎉",
        videoUrl: "",
        thumbnail: "",
      });
    }

    return NextResponse.json(completion);
  } catch (error) {
    console.error("Error fetching game completion:", error);
    return NextResponse.json({
      title: "Congratulations!",
      message: "You completed the memory match game! 🎉",
      videoUrl: "",
      thumbnail: "",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token !== ADMIN_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, message, videoUrl, thumbnail } = body;

    if (!title || !message || !videoUrl) {
      return NextResponse.json(
        { error: "Title, message, and videoUrl are required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        {
          _id: Date.now().toString(),
          title,
          message,
          videoUrl,
          thumbnail,
          isActive: true,
          createdAt: new Date(),
        },
        { status: 201 }
      );
    }

    // Deactivate all other completions
    await GameCompletion.updateMany({}, { isActive: false });

    // Create new completion
    const completion = new GameCompletion({
      title,
      message,
      videoUrl,
      thumbnail,
      isActive: true,
    });

    await completion.save();
    return NextResponse.json(completion, { status: 201 });
  } catch (error) {
    console.error("Error creating game completion:", error);
    return NextResponse.json(
      { error: "Failed to create game completion" },
      { status: 500 }
    );
  }
}
