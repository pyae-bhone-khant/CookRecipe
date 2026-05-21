import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";

//Validation  schema
const schema = yup.object().shape({
  user_id: yup
    .number()
    .typeError("User ID must be a number")
    .required("User ID is required"),

  recipe_id: yup
    .number()
    .typeError("Recipe ID must be a number")
    .required("Recipe ID is required"),
});

// Update like API
export async function PUT(req, { params }) {
  try {
    const likeId = parseInt(params.id); // parseInt
    const body = await req.json();
    const validatedData = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    //update prisma like id
    await prisma.like.update({
      where: { id: likeId },
      data: validatedData,
    });

    return NextResponse.json({
      message: "Like is successfully updated.",
      likeId,
      bodyData: body,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation Failed",
          errors: error.inner.map((e) => ({
            //we used map for the output that we want
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
      {
        status: 500,
      }
    );
  }
}

// delete Like
export async function DELETE(req, { params }) {
  const likeId = parseInt(params.id);

  try {
    await prisma.like.delete({
      where: { id: likeId },
    });
    return NextResponse.json(
      { message: "Like is successful deleted." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Like not found or delete failed" },
      { status: 404 }
    );
  }
}

//Detail Like API
export async function GET(req, { params }) {
  const likeId = parseInt(params.id);
  //Find Like in database
  const likes = await prisma.like.findUnique({
    where: {
      id: likeId,
    },
  });

  return NextResponse.json(likes);
}
