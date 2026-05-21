import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/favourites/user?userId={userId}
 * Fetches favorite recipes for a specific user with recipe details
 */
export async function GET(req) {
  try {
    // Get userId from query params
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Parse userId to integer
    // const userIdInt = parseInt(userId);

    // Fetch favorites with recipe details
    const favorites = await prisma.favourite.findMany({
      where: {
        user_id: userId
      },
      include: {
        recipe: {
          include: {
            user: true // Include recipe author information
          }
        }
      },
      // orderBy: {
      //   createdAt: 'desc' // Most recent first
      // }
    });

    // Transform the data to match the expected format for StaticRecipeCard
    const favoriteRecipes = favorites.map(favorite => ({
      id: favorite.recipe.id,
      name: favorite.recipe.name,
      image_url: favorite.recipe.image_url,
      category_id: favorite.recipe.category_id,
      user: favorite.recipe.user,
      rating: 4.7, // Default rating
      createdAt: favorite.recipe.createdAt,
      // Include other recipe fields as needed
      pre_cooking_time: favorite.recipe.pre_cooking_time,
      cooking_time: favorite.recipe.cooking_time,
      ingredient: favorite.recipe.ingredient,
      instruction: favorite.recipe.instruction,
      status: favorite.recipe.status
    }));

    return NextResponse.json(favoriteRecipes);
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return NextResponse.json(
      { message: "Failed to fetch favorite recipes", error: error.message },
      { status: 500 }
    );
  }
}
