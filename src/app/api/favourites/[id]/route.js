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

// Update Favourite API
export async function PUT(req, { params }) {
  try {
    const favouriteId = parseInt(params.id); // parseInt
    const body = await req.json();
    const validatedData = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    //update prisma favourite id
    await prisma.favourite.update({
      where: { id: favouriteId },
      data: validatedData,
    });

    return NextResponse.json({
      message: "User is successfully updated.",
      favouriteId,
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

// delete Favourite
export async function DELETE(req, { params }) {
  const favouriteId = parseInt(params.id);

  try {
    await prisma.favourite.delete({
      where: { id: favouriteId },
    });
    return NextResponse.json(
      { message: "User is successful deleted." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "User not found or delete failed" },
      { status: 404 }
    );
  }
}

//Detail Recipe API
export async function GET(req, { params }) {
  const favouriteId = parseInt(params.id);
  //Find student in database
  const favourites = await prisma.favourite.findUnique({
    where: {
      id: favouriteId,
    },
  });

  return NextResponse.json(favourites);
}
