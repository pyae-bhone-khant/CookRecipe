
import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma";

const schema = yup.object().shape({
  name: yup.string().required(),
});

export async function GET(req, { params }) {
    const categoryId = params.id;

    try {
      const categories = await prisma.category.findUnique({
        where: {
            id: categoryId,
        },
    });
    return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "User not found" },
        );

    }
}



//User Update API
export async function PUT(req, { params }) {
    try {
        const categoryId = params.id; // parseInt
        const body = await req.json();
        const validatedData = await schema.validate(body, {
            abortEarly: false,
            stripUnknown: true
        });
        //update prisma user id
        await prisma.category.update({
            where: { id: categoryId },
            data: validatedData,
        });

        return NextResponse.json({
            message: "Category is successfully updated.",
            categoryId,
            bodyData: body
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return NextResponse.json(
                {
                    message: "Validation Failed",
                    errors: error.inner.map((e) => ({       //we used map for the output that we want
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

// delete
export async function DELETE(req, { params }) {
    const categoryId = parseInt(params.id);

    try {
        await prisma.category.delete({
            where: { id: categoryId },
        });
        return NextResponse.json(
            { message: "Category is successful deleted." },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Category not found or delete failed" },
            { status: 404 }
        );
    }
}