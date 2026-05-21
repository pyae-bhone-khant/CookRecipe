import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { recipeId, action } = body; // ✅ FIXED: get `action`, not `type`

  if (!recipeId || !action) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: parseInt(recipeId) },
  });

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  let icon = '';
  let label = '';
  switch (action) {
    case 'created':
      icon = '🧾';
      label = 'Viewed';
      break;
    case 'liked':
      icon = '❤️';
      label = 'Liked';
      break;
    case 'commented':
      icon = '💬';
      label = 'Commented on';
      break;
    default:
      return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  }

  try {
    const history = await prisma.history.create({
      data: {
        userId: session.user.id,
        recipeId: parseInt(recipeId),
        action, // ✅ must match ACTION enum: 'created' | 'liked' | 'commented'
        message: `${label} recipe: ${recipe.name}`,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



