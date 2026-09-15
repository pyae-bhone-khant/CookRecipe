import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/histories/[id] - Get a specific history by ID
export async function GET(request, { params }) {
  try {
    const history = await prisma.history.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        recipe: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
      },
    });

    if (!history) {
      return NextResponse.json(
        { error: "History not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

// PUT /api/histories/[id] - Update a history
export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const history = await prisma.history.update({
      where: { id: parseInt(params.id) },
      data: body,
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error updating history:", error);
    return NextResponse.json(
      { error: "Failed to update history" },
      { status: 500 }
    );
  }
}

// DELETE /api/histories/[id] - Delete a history
export async function DELETE(request, { params }) {
  try {
    await prisma.history.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { message: "History deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting history:", error);
    return NextResponse.json(
      { error: "Failed to delete history" },
      { status: 500 }
    );
  }
}

