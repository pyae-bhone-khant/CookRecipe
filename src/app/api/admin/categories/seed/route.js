import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/categories/seed
 * Seed default categories into the database
 */
export async function POST() {
  try {
    const defaultCategories = [
      { name: "Breakfast" },
      { name: "Lunch" },
      { name: "Dinner" },
      { name: "Dessert" },
      { name: "Snacks" },
      { name: "Beverages" },
      { name: "Appetizers" },
      { name: "Main Course" },
      { name: "Soups" },
      { name: "Salads" },
      { name: "Vegetarian" },
      { name: "Vegan" },
    ];

    const createdCategories = [];

    for (const category of defaultCategories) {
      // Check if category already exists
      const existing = await prisma.category.findFirst({
        where: {
          name: {
            equals: category.name,
            mode: 'insensitive'
          }
        }
      });

      if (!existing) {
        const created = await prisma.category.create({
          data: { name: category.name }
        });
        createdCategories.push(created);
      } else {
        createdCategories.push(existing);
      }
    }

    return NextResponse.json({
      message: "Categories seeded successfully!",
      categories: createdCategories,
      total: createdCategories.length
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json(
      { message: "Failed to seed categories", error: error.message },
      { status: 500 }
    );
  }
}
