import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma"; //pisma ချိတ်

const schema = yup.object().shape({
  user_id: yup
    .number()
    .typeError("User ID must be a number")
    .required("User ID is required"),

  recipe_id: yup
    .number()
    .typeError("Recipe ID must be a number")
    .required("Recipe ID is required"),

    comment_text: yup
        .string()
        .min(5, "Comments should be at least 5 characters")
        .required("Comments are required"),

});



import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust this path

// POST /api/comments
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { text, recipeId,parentId} = body;

  if (!text || !recipeId) {
    return new Response("Missing fields", { status: 400 });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        recipeId: parseInt(recipeId),
        userId: session.user.id,
        parentId:parentId ? parseInt(parentId) :null,
      },
      include: {
        user: true,
      },
    });

    return Response.json(newComment);
  } catch (error) {
    console.error("POST error:", error);
    return new Response("Server error", { status: 500 });
  }
}

// GET /api/comments?recipeId=1
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recipeId = searchParams.get("recipeId");

  if (!recipeId) {
    return new Response("Missing recipeId", { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { recipeId: parseInt(recipeId),parentId: null },
      orderBy: { createdAt: "desc" },
      include: { 
        user: true ,
      replies: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
        },
      }
    });

    const topLevelComments = comments.filter(c => !c.parentId);
    return Response.json(topLevelComments);
  } catch (error) {
    console.error("GET error:", error);
    return new Response("Server error", { status: 500 });
  }
}



