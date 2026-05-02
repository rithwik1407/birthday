import { connectToDatabase } from "@/lib/db";
import { Wish } from "@/lib/models/Wish";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isOpened } = body;

    const db = await connectToDatabase();

    if (!db) {
      // Return mock response if no DB
      return NextResponse.json(
        {
          _id: id,
          isOpened: isOpened,
        },
        { 
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        }
      );
    }

    const wish = await Wish.findByIdAndUpdate(
      id,
      { isOpened: isOpened },
      { new: true }
    );

    if (!wish) {
      return NextResponse.json(
        { error: "Wish not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(wish, { 
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error updating wish:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update wish: " + errorMessage },
      { status: 500 }
    );
  }
}
