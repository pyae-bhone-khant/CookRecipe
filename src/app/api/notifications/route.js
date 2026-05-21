
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Get all notifications for current user
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { user_id: session.user.id },
    orderBy: { createdAt: "desc" } // အသစ်ဆုံးကအရင်ပြအောင်
  });

  return Response.json({ notifications });
}

// POST: Create new notification
export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, message } = body;

    if (!user_id || !message) {
      return NextResponse.json(
        { error: "Missing user_id or message" },
        { status: 400 }
      );
    }

    const newNotification = await prisma.notification.create({
      data: {
        user_id,
        message,
        is_read: false,
      },
    });

    // Real-time update ပို့ပါ
    serverIo.emit(`user:${user_id}:notification`, newNotification);

    return NextResponse.json(
      { message: "Notification created", data: newNotification },
      { status: 200 }
    );

  } catch (error) {
    console.error("Notification creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
