import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as yup from "yup";
import { getToken } from "next-auth/jwt";

// Validation schema for creating a category
const schema = yup.object().shape({
  name: yup.string().required("Category name is required").min(3, "Category name must be at least 3 characters long."),
});

/**
 * GET /api/admin/categories
 * Get all categories. This endpoint is public for recipe creation forms.
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    // The frontend expects an object with a 'categories' key
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: "Failed to fetch categories.", error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/categories
 * Create a new category. This is an admin-only action.
 */
export async function POST(request) {
  // Protect the route by checking for admin role
  // const token = await getToken({ req: request });
  // if (token?.role !== 'admin') {
  //     return NextResponse.json({ message: "Unauthorized. You must be an admin to perform this action." }, { status: 403 });
  // }

  try {
    const body = await request.json();
    const validatedData = await schema.validate(body, { abortEarly: false, stripUnknown: true });

    const { name } = validatedData;

    // Check if category with the same name already exists (case-insensitive)
    // const existingCategory = await prisma.category.findFirst({
    //   where: {
    //     name: {
    //       equals: name,
    //       mode: 'insensitive'
    //     }
    //   }
    // });

    // if (existingCategory) {
    //   return NextResponse.json({ message: "A category with this name already exists." }, { status: 409 });
    // }

    const category = await prisma.category.create({ data: { name } });

    return NextResponse.json({ message: "Category created successfully!", category }, { status: 201 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }

    console.error('Error in POST /api/admin/categories:', error);
    return NextResponse.json({ message: "Failed to create category.", error: error.message }, { status: 500 });
  }
}