import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";

const schema = yup.object().shape({
  user_id: yup
    .string()
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

  image_url: yup.mixed().required("Image is required"),

  video_url: yup
    .string()
    .url("Must be a valid URL")
    .nullable()
    .optional(),

  status: yup
    .string()
    .oneOf(["pending", "approve", "reject"], "Invalid status")
    .default("pending"),
});



//get favourites list api
export async function GET() {
  const recipes = await prisma.recipe.findMany({
    include: { user: true,
      category:true,
     }
  });
  return NextResponse.json({recipes});
}




export async function POST(request) {
  try {
    const rawData = await request.json();
    console.log('Received raw data:', rawData);

    const validatedData = await schema.validate(rawData, { abortEarly: false });
    console.log('Validated data:', validatedData);

    const {
      user_id,
      name,
      category_id,
      pre_cooking_time,
      cooking_time,
      ingredient,
      instruction,
      image_url,
      video_url,
      status,
    } = validatedData;

    try {
      const recipe = await prisma.recipe.create({
        data: {
          user_id,
          name,
          category_id,
          pre_cooking_time,
          cooking_time,
          ingredient,
          instruction,
          image_url,
          video_url,
          status,
        },
      });

      console.log('Recipe saved successfully with Prisma, ID:', recipe.id);
      return NextResponse.json(
        {
          message: 'Recipe saved successfully!',
          recipeId: recipe.id,
          recipe: recipe
        },
        { status: 201 }
      );

    } catch (dbError) {
      console.error('Error saving recipe with Prisma:', dbError);

      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { message: 'A recipe with this name already exists or a unique field is duplicated.', error: dbError.message },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { message: 'Failed to save recipe to database.', error: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      console.error('Yup Validation Error:', error.errors);
      return NextResponse.json(
        { message: 'Validation failed', errors: error.errors },
        { status: 400 }
      );
    } else {
      console.error('Error in POST /api/recipes:', error);
      if (error.message.includes('JSON')) {
        return NextResponse.json(
          { message: 'Invalid JSON body provided.', error: error.message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { message: 'Failed to save recipe.', error: error.message },
        { status: 500 }
      );
    }
  }
}
