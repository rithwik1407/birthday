import { connectToDatabase } from "@/lib/db";
import { Video } from "@/lib/models/Video";
import { sampleVideos } from "@/lib/sample-data";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-secret";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      // Return sample data if no DB connection
      return NextResponse.json(sampleVideos, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    const videos = await Video.find().sort({ createdAt: -1 });
    return NextResponse.json(videos, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(sampleVideos, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
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
    const { title, url, thumbnail, recordedBy, hint } = body;

    if (!title || !url) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      // Return mock response if no DB
      return NextResponse.json(
        {
          _id: Date.now().toString(),
          title,
          url,
          thumbnail,
          recordedBy,
          hint,
          createdAt: new Date(),
        },
        { status: 201 }
      );
    }

    const video = new Video({
      title,
      url,
      thumbnail,
      recordedBy,
      hint,
    });

    await video.save();
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
