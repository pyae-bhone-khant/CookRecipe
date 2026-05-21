import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/favourites/delete?userId={userId}&recipeId={recipeId}
 * Removes a recipe from a user's favorites
 */
export async function DELETE(req) {
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
    // const userIdInt = parseInt(userId);
    const recipeIdInt = parseInt(recipeId);

    // Delete the favorite
    await prisma.favourite.deleteMany({
      where: {
        user_id: userId,
        recipe_id: recipeIdInt
      }
    });

    return NextResponse.json({
      message: "Favorite removed successfully",
      success: true
    });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { message: "Failed to remove favorite", error: error.message },
      { status: 500 }
    );
  }
}
