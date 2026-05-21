// File: /app/api/users/profile/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Update this path as needed
import { prisma } from "@/lib/prisma";

export async function PUT(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, image } = body; // Only for user

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || session.user.name,
        email: email || session.user.email,
        image: image || null,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/profile error:", error);
    return NextResponse.json(
      { message: "Failed to update user profile", error: error.message },
      { status: 500 }
    );
  }
}
