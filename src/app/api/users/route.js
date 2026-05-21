import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as yup from "yup";
import bcrypt from "bcrypt";

// Validation schema for user creation, consistent with the frontend.
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Must be a valid email").required("Email is required"),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number'),
});

const updateSchema = yup.object().shape({
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number'),
});

/**
 * GET /api/users
 * Get all users.
 */
export async function GET() {
  // In a real-world app, you'd want to protect this endpoint,
  // for example, to only allow admins to see all users.
  const users = await prisma.user.findMany({
    // Explicitly select fields to prevent sending sensitive data like password hashes.
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });
  return NextResponse.json(users);
}

/**
 * POST /api/users
 * Create a new user (Sign-up).
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = await schema.validate(body, { abortEarly: false, stripUnknown: true });

    const { username, email, password } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({ data: { username, email, password: hashedPassword } });

    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: "User created successfully!", user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }

    console.error('Error in POST /api/users:', error);
    return NextResponse.json({ message: "Failed to create user.", error: error.message }, { status: 500 });
  }
}
