import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma"; 
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const schema = yup.object().shape({
  user_id: yup
    .number()
    .typeError("User ID must be a number")
    .required("User ID is required"),

  recipe_id: yup
    .number()
    .typeError("Recipe ID must be a number")
    .required("Recipe ID is required"),
});




// /api/likes/route.js

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get("userId");
//   const recipeId = parseInt(searchParams.get("recipeId"));

  
//   if (!userId || isNaN(recipeId)) {
//     return new Response(JSON.stringify({ error: "Missing userId or recipeId" }), {
//       status: 400,
//     });
//   }

//   try {
//     const like = await prisma.like.findFirst({
//       where: {
//         userId,
//         recipeId:parseInt(recipeId),
//       },
//     });

//     return Response.json({ liked: !!like });
//   } catch (error) {
//     console.error("GET /likes error:", error);
//     return new Response(JSON.stringify({ error: "Internal server error" }), {
//       status: 500,
//     });
//   }
// }

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recipeId = searchParams.get("recipeId");

  if (!recipeId) {
    return new Response("Missing recipeId", { status: 400 });
  }

  try {
    const likes = await prisma.like.findMany({
      where: {
        recipeId: parseInt(recipeId),
      },
      include: {
        user: true, // ✅ make sure user is loaded
      },
    });

    return Response.json({
      count: likes.length,
      users: likes.map((like) => ({
        id: like.user?.id ?? "unknown",
        name: like.user?.name ?? "Anonymous",
        email: like.user?.email ?? null,
        // add more fields if needed
      })),
    });
  } catch (error) {
    console.error("GET /api/likes error:", error);
    return new Response("Server error", { status: 500 });
  }
}


// /api/likes/route.js

export async function PUT(req) {
  const { userId, recipeId } = await req.json();

  if (!userId || !recipeId) {
    return new Response("Missing userId or recipeId", { status: 400 });
  }

  try {
    const existing = await prisma.like.findFirst({
      where: {
        userId,
        recipeId: parseInt(recipeId),
      },
    });

    let action;

    if (existing) {
      await prisma.like.delete({
        where: { id: existing.id },
      });
      action = "unliked";
    } else {
      await prisma.like.create({
        data: {
          userId,
          recipeId: parseInt(recipeId),
        },
      });
      action = "liked";
    }

    return Response.json({ success: true, action });
  } catch (error) {
    console.error("PUT /api/likes error:", error);
    return new Response("Server error", { status: 500 });
  }
}

export async function POST(req) {
  const { userId, recipeId } = await req.json();

  if (!userId || !recipeId) {
    return new Response("Missing userId or recipeId", { status: 400 });
  }

  try {
    // Check if already liked
    const existing = await prisma.like.findFirst({
      where: {
        userId,
        recipeId: parseInt(recipeId),
      },
    });

    if (existing) {
      return new Response("Already liked", { status: 409 }); // Conflict
    }

    const like = await prisma.like.create({
      data: {
        userId,
        recipeId: parseInt(recipeId),
      },
    });

    return Response.json({ success: true, like });
  } catch (error) {
    console.error("POST /api/likes error:", error);
    return new Response("Server error", { status: 500 });
  }
}

