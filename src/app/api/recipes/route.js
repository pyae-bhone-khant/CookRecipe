import { unstable_cache, revalidateTag } from "next/cache";
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
    .required("Category is required"),

  pre_cooking_time: yup.string().required("Pre-cooking time is required"),

  cooking_time: yup.string().required("Cooking time is required"),

  image_url: yup.string().required("Image is required"),

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

const DEFAULT_LIMIT = 24;

async function loadRecipes({ page, limit, search, category }) {
  const skip = (page - 1) * limit;

  const where = {
    status: "approve",
    ...(search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {}),
    ...(category
      ? {
          category: {
            name: {
              equals: category,
              mode: "insensitive",
            },
          },
        }
      : {}),
  };

  const [recipes, total] = await prisma.$transaction([
    prisma.recipe.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        image_url: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    }),
    prisma.recipe.count({ where }),
  ]);

  const mappedRecipes = recipes.map((recipe) => {
    const totalRating = recipe.ratings.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = recipe.ratings.length
      ? Number((totalRating / recipe.ratings.length).toFixed(1))
      : 0;

    return {
      ...recipe,
      averageRating,
      likesCount: recipe._count.likes,
      commentsCount: recipe._count.comments,
      ratings: undefined,
      _count: undefined,
    };
  });

  return {
    recipes: mappedRecipes,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

const getCachedRecipes = unstable_cache(
  async (page, limit, search, category) => loadRecipes({ page, limit, search, category }),
  ["recipes-list"],
  {
    revalidate: 180,
    tags: ["recipes-list"],
  }
);

// GET endpoint
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || `${DEFAULT_LIMIT}`, 10);
    const search = searchParams.get("search")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";

    const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = Number.isNaN(limit) || limit < 1 ? DEFAULT_LIMIT : Math.min(limit, 50);

    const result = await getCachedRecipes(safePage, safeLimit, search, category);

    return NextResponse.json({
      recipes: result.recipes,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: result.total,
        totalPages: result.totalPages,
        hasNextPage: safePage < result.totalPages,
        hasPrevPage: safePage > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
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
      revalidateTag("recipes-list");

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
