import { connectToDatabase } from "@/lib/db";
import { GameImage } from "@/lib/models/GameImage";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-secret";

// Default fallback images
const DEFAULT_IMAGES = [
  "🌹",
  "💕",
  "✨",
  "🎀",
  "💐",
  "🌸",
  "💖",
  "🎁",
];

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      // Return default images if no DB
      return NextResponse.json(DEFAULT_IMAGES, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    const images = await GameImage.find({ isActive: true })
      .sort({ order: 1 })
      .limit(8);

    if (images.length === 0) {
      return NextResponse.json(DEFAULT_IMAGES, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    return NextResponse.json(images.map((img) => img.imageUrl), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching game images:", error);
    return NextResponse.json(DEFAULT_IMAGES, {
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
    const { images } = body;

    if (!Array.isArray(images) || images.length !== 8) {
      return NextResponse.json(
        { error: "Must provide exactly 8 images" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        {
          _id: Date.now().toString(),
          images,
          createdAt: new Date(),
        },
        { status: 201 }
      );
    }

    // Deactivate all existing images
    await GameImage.updateMany({}, { isActive: false });

    // Create new images
    const gameImages = images.map((imageUrl: string, index: number) =>
      new GameImage({
        imageUrl,
        order: index,
        isActive: true,
      })
    );

    await GameImage.insertMany(gameImages);
    return NextResponse.json(images, { status: 201 });
  } catch (error) {
    console.error("Error creating game images:", error);
    return NextResponse.json(
      { error: "Failed to create game images" },
      { status: 500 }
    );
  }
}
