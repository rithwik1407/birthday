import { connectToDatabase } from "@/lib/db";
import { Video } from "@/lib/models/Video";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { guessedBy } = body;

    if (!guessedBy) {
      return NextResponse.json(
        { error: "guessedBy is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      // Return mock response if no DB
      return NextResponse.json(
        {
          _id: id,
          guessedBy,
          updatedAt: new Date(),
        },
        { status: 200 }
      );
    }

    const video = await Video.findByIdAndUpdate(
      id,
      { guessedBy },
      { new: true }
    );

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("Error updating video:", error);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}
