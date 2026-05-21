


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = parseInt(searchParams.get("recipeId"));

    if (!recipeId || isNaN(recipeId)) {
      return NextResponse.json(
        { error: "Valid recipeId is required" },
        { status: 400 }
      );
    }

    // Calculate average rating
    const aggregate = await prisma.rating.aggregate({
      where: { recipeId },
      _avg: { rating: true },
      _count: { _all: true }
    });

    return NextResponse.json({
      average: aggregate._avg.rating ? parseFloat(aggregate._avg.rating.toFixed(1)) : 0,
      count: aggregate._count._all || 0
    });

  } catch (error) {
    console.error("GET /api/ratings/average error:", error);
    return NextResponse.json(
      { error: "Failed to calculate average rating", details: error.message },
      { status: 500 }
    );
  }
}

