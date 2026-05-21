

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";      // adjust path to your authOptions
import { prisma } from "@/lib/prisma";         // adjust path to your prisma client
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

   // string

  try {
    const histories = await prisma.history.findMany({
      where: { userId: session.user.id },  // use string id
      orderBy: { createdAt: 'desc' },
      select: {
      id: true,
      message: true,       // ✅ Ensure this is selected
      action: true,
      createdAt: true,
    },
    });

    return NextResponse.json(histories);
  } catch (error) {
    console.error('Error fetching histories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

//Deleted History
// export async function DELETE(req) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get('userId');

//   await prisma.history.deleteMany({
//     where: { userId },
//   });

//   return NextResponse.json({ success: true });
// }
