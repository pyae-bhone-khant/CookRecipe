
import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";


//Validation  schema
const schema = yup.object().shape({
  user_id: yup
    .number()
    .typeError("User ID must be a number")
    .required("User ID is required"),
  name: yup.string().required("Recipe name is required"),

  ingredient: yup
    .string()
    .min(10, "Ingredients should be at least 10 characters")
    .required("Ingredients are required"),

  instruction: yup
    .string()
    .min(10, "Instructions should be at least 10 characters")
    .required("Instructions are required"),

  category_id: yup
    .string()
    // .oneOf(["breakfast", "lunch", "dinner", "dessert"], "Invalid category")
    .required("Category is required"),

  pre_cooking_time: yup.string().required("Pre-cooking time is required"),

  cooking_time: yup.string().required("Cooking time is required"),

  image: yup.mixed().required("Image is required"),

  video_url: yup
    .string()
    .url("Must be a valid URL")
    .required("Video URL is required"),

  status: yup
    .string()
    .oneOf(["pending", "approve", "reject"], "Invalid status"),
});

// Update Recipe API
// export async function PUT(req, { params }) {
//   try {
//     const { id } = await params;
//     const recipeId = parseInt(id); // parseInt
//     const body = await req.json();
//     const validatedData = await schema.validate(body, {
//       abortEarly: false,
//       stripUnknown: true
//     });
//     //update prisma recipe id
//     await prisma.recipe.update({
//       where: { id: recipeId },
//       data: validatedData,
//     });
//   }
// }


export async function PUT(req, { params }) {
  try {
    const recipeId = parseInt(params.id);
    const { status } = await req.json();

    const validStatuses = ["pending", "approve", "reject"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Allowed values are: ${validStatuses.join(
            ", "
          )}`,
          received: status,
        },
        { status: 400 }
      );
    }

    // Update the recipe status
    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: { status },
    });

    // Insert notification if status is "approve" or "reject"
    if (status === "approve" || status === "reject") {
      const message = `Your recipe "${updatedRecipe.name}" has been ${status}.`;
      await prisma.notification.create({
        data: {
           user: { connect: { id: updatedRecipe.user_id } },
          message,
          // type: status,
        },
      });
    }

    return NextResponse.json({
      message: "Recipe status updated and notification created.",
      recipeId,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation Failed",
          errors: error.inner.map((e) => ({
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
      { status: 500 }
    );
  }
}

// delete Recipe
export async function DELETE(req, { params }) {
  const { id } = await params;
  const recipeId = parseInt(id);

    try {
        await prisma.recipe.delete({
            where: { id: recipeId },
        });
        return NextResponse.json(
            { message: "User is successful deleted." },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "User not found or delete failed" },
            { status: 404 }
        );
    }
}

//Detail Recipe API
export async function GET(req, { params }) {
  const { id } = await params;
  const recipeId = parseInt(id);

  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
      include: {
        user: true, // Include user information
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { message: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { message: 'Failed to fetch recipe', error: error.message },
      { status: 500 }
    );
  }
}
