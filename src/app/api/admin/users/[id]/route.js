
import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";


//Validation  schema 
const schema = yup.object().shape({
    username: yup.string().required("Name is required"),
       email: yup.string().required("Email is required"),
       password: yup.string().required("Password is required"),

});

//User Update API
export async function PUT(req, { params }) {
  try {
    const userId = parseInt(params.id);
    
    // Request body ကို ဖတ်ခြင်း
    const body = await req.json();
    
    // Data validation
    const validatedData = await userSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Database update
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
    
  } catch (error) {
    // Validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    
    // Other errors
    return NextResponse.json(
      {
        success: false,
        message: "Error updating profile",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// delete
export async function DELETE(req, { params }) {
    const userId = parseInt(params.id);

    try {
        await prisma.user.delete({
            where: { id: userId },
        });
        return NextResponse.json(
            { message: "User is successful deleted." },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "User not found or delete failed" },
            { status: 404 }
        );
    }
}

