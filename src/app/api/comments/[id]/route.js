import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
//Validation  schema
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

// Update Comment API
export async function PUT(req, { params }) {
  try {
    const commentId = parseInt(params.id); // parseInt
    const body = await req.json();
    const validatedData = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    //update prisma recipe id
    await prisma.comment.update({
      where: { id: commentId },
      data: validatedData,
    });

    return NextResponse.json({
      message: "Comment is successfully updated.",
      commentId,
      bodyData: body,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation Failed",
          errors: error.inner.map((e) => ({
            //we used map for the output that we want
            path: e.path,
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "Unexpected error",
        error: error.message || error,
      },
      {
        status: 500,
      }
    );
  }
}

// delete Comment
// export async function DELETE(req, { params }) {
//   const session = await getServerSession(authOptions);
//   if (!session) return new Response("Unauthorized", { status: 401 });

//   const commentId = parseInt(params.id);

//   // Verify ownership
//   const existingComment = await prisma.comment.findUnique({
//     where: { id: commentId },
//   });

//   if (!existingComment || existingComment.userId !== session.user.id) {
//     return new Response("Forbidden", { status: 403 });
//   }

//   try {
//     await prisma.comment.delete({
//       where: { id: commentId },
//     });

//     return new Response("Deleted", { status: 200 });
//   } catch (error) {
//     console.error("DELETE /comments/:id error", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }


export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const commentId = parseInt(params.id);

  // Comment + Recipe owner data ယူ
  const existingComment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { 
      recipe: { select: { user_id: true } } // recipe owner ID
    },
  });

  if (!existingComment) {
    return new Response("Not Found", { status: 404 });
  }

  const isCommentOwner = existingComment.userId === session.user.id;
  const isRecipeOwner = existingComment.recipe?.user_id === session.user.id;

  // Permission check
  if (!isCommentOwner && !isRecipeOwner) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return new Response("Deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE /comments/:id error", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


