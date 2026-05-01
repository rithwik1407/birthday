import { connectToDatabase } from "@/lib/db";
import { Wish } from "@/lib/models/Wish";
import { sampleWishes } from "@/lib/sample-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      // Return sample data if no DB connection
      return NextResponse.json(sampleWishes);
    }

    const wishes = await Wish.find().sort({ createdAt: -1 });
    return NextResponse.json(wishes);
  } catch (error) {
    console.error("Error fetching wishes:", error);
    return NextResponse.json(sampleWishes);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderName, message, hint, revealPhoto, revealMessage, category } = body;

    if (!senderName || !message || !revealPhoto || !revealMessage) {
      return NextResponse.json(
        { error: "Sender name, message, reveal photo, and reveal message are required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      // Return mock response if no DB
      return NextResponse.json(
        {
          _id: Date.now().toString(),
          senderName,
          message,
          senderPhoto: "",
          hint: hint || "",
          revealPhoto,
          revealMessage,
          category: category || "friend",
          createdAt: new Date(),
        },
        { status: 201 }
      );
    }

    try {
      // Delete all old wishes with 'name' field to avoid schema conflicts
      await Wish.deleteMany({ name: { $exists: true } });
    } catch (e) {
      console.error("Error cleaning old wishes:", e);
    }

    // Create wish object with all required fields
    const wishData = {
      senderName: senderName.trim(),
      message: message.trim(),
      senderPhoto: "",
      hint: hint ? hint.trim() : "",
      revealPhoto: revealPhoto.trim(),
      revealMessage: revealMessage.trim(),
      category: category || "friend",
    };

    const wish = new Wish(wishData);
    const savedWish = await wish.save();
    return NextResponse.json(savedWish, { status: 201 });
  } catch (error) {
    console.error("Error creating wish:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create wish: " + errorMessage },
      { status: 500 }
    );
  }
}
