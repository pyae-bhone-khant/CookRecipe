import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import based on your project structure

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ message: "Username is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
