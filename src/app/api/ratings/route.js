

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const recipeId = parseInt(searchParams.get("recipeId"));

    if (!recipeId || isNaN(recipeId)) {
      return NextResponse.json(
        { error: "Valid recipeId is required" },
        { status: 400 }
      );
    }

    // Return user-specific rating
    if (!session?.user?.id) {
      return NextResponse.json({ rating: 0 });
    }

    const rating = await prisma.rating.findUnique({
      where: {
        userId_recipeId: {
          userId: session.user.id,
          recipeId
        }
      }
    });

    return NextResponse.json({ rating: rating?.rating || 0 });

  } catch (error) {
    console.error("GET /api/ratings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { recipeId, rating } = await request.json();

    if (!recipeId || rating === undefined || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating data" },
        { status: 400 }
      );
    }

    const result = await prisma.rating.upsert({
      where: {
        userId_recipeId: {
          userId: session.user.id,
          recipeId: parseInt(recipeId)
        }
      },
      update: { rating: parseInt(rating) },
      create: {
        userId: session.user.id,
        recipeId: parseInt(recipeId),
        rating: parseInt(rating)
      }
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("POST /api/ratings error:", error);
    return NextResponse.json(
      { error: "Failed to save rating" },
      { status: 500 }
    );
  }
}