import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/users/recipes?userId={userId}
 * Fetches recipes created by a specific user
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


    // Fetch recipes by user ID
    const recipes = await prisma.recipe.findMany({
      where: {
        user_id: userId
      },
      include: {
        user: true,
        category:true, // Include user information
      },
      orderBy: {
        createdAt: 'desc' // Most recent first
      }
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching user recipes:", error);
    return NextResponse.json(
      { message: "Failed to fetch user recipes", error: error.message },
      { status: 500 }
    );
  }
}
