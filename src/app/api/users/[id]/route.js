
import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Validation schema for partial updates (more flexible)
const updateSchema = yup.object().shape({
  username: yup.string().optional(),
  email: yup.string().email("Invalid email format").optional(),
  phone: yup.string().optional(),
  gender: yup.string().optional(),
  birthdate: yup.string().optional(),
  image_url: yup.string().optional(),
  coverImage: yup.string().optional(),
});

const passwordChangeSchema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number'),
});

//User Get API
export async function GET(req, { params }) {
  try {
    const userId = await params.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 500 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET User error:", error);
    return NextResponse.json({
      message: "User not found",
      error: error.message || error,
    }, {
      status: 404
    });
  }
}


//User Update API
export async function PUT(req, { params }) {
  try {
    const userId = await params.id;
    const body = await req.json();

    // Use the flexible updateSchema for PUT requests too
    const validatedData = await updateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true
    });

    // Handle password hashing if provided
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, 10);
    }

    // Handle image field mapping (frontend sends 'image', DB expects 'image_url')
    if (body.image) {
      validatedData.image_url = body.image;
      delete validatedData.image;
    }

    // Update user with validated data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        username: true,
        email: true,
        image_url: true,
        coverImage: true,
        phone: true,
        gender: true,
        birthdate: true,
      },
    });

    return NextResponse.json({
      message: "User successfully updated.",
      user: updatedUser
    });
  } catch (error) {
    console.error("PUT User error:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation Failed",
          errors: error.inner.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        }, { status: 400 }
      );
    }
    return NextResponse.json({
      message: "Unexpected error",
      error: error.message || error,
    }, {
      status: 500
    });
  }
}

export async function PATCH(req, { params }) {
  try {
    const userId = params.id;
    const body = await req.json();

    const validatedData = await updateSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    console.log("Validated data:", validatedData);

    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, 10);
    }

    if (body.image) {
      validatedData.image_url = body.image;
    }
    if (body.image_url) validatedData.image_url = body.image_url;
    if (body.coverImage) validatedData.coverImage = body.coverImage;

    console.log("Final data to update:", validatedData);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        username: true,
        email: true,
        image_url: true,
        coverImage: true,
      },
    });

    console.log("Updated user:", updatedUser); // Debug log

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("PATCH API error:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.inner.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Unexpected error",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}

// delete
export async function DELETE(req, { params }) {
  const userId = await params.id; // Keep as string for cuid

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json(
      { message: "User successfully deleted." },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "User not found or delete failed" },
      { status: 404 }
    );
  }
}
