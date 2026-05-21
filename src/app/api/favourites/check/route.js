import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/favourites/check?userId={userId}&recipeId={recipeId}
 * Checks if a recipe is favorited by a user
 */
export async function GET(req) {
  try {
    // Get params from query
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const recipeId = url.searchParams.get("recipeId");

    if (!userId || !recipeId) {
      return NextResponse.json(
        { message: "User ID and Recipe ID are required" },
        { status: 400 }
      );
    }

    // Parse to integers
    const userIdInt = parseInt(userId);
    const recipeIdInt = parseInt(recipeId);

    // Check if favorite exists
    const favorite = await prisma.favourite.findFirst({
      where: {
        user_id: userIdInt,
        recipe_id: recipeIdInt
      }
    });

    return NextResponse.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return NextResponse.json(
      { message: "Failed to check favorite status", error: error.message },
      { status: 500 }
    );
  }
}
